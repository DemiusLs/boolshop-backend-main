import connection from "../db.js";
import { sendTestEmail } from "../emailService.js";

const slowCon = connection.promise();

// GET tutti gli ordini
const getAllOrders = async (req, res) => {
  try {
    const [rows] = await slowCon.query("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST crea nuovo ordine
const createOrder = async (req, res) => {
  const {
    full_name,
    mail,
    phone_number,
    billing_address,
    shipping_address,
    order_status,
    payment_intent_id,
    prints,
    discount_code
  } = req.body;

const baseUrl = process.env.BASE_URL || 'http://localhost:3001';
  if (!Array.isArray(prints)) {
    return res.status(400).json({ error: "'prints' deve essere un array" });
  }

  try {
    await slowCon.beginTransaction();

    
    // 1. Verifica stock
    for (const item of prints) {
     const [[printRow]] = await slowCon.query(
   "SELECT stock FROM prints WHERE slug = ?",
  [item.slug]
);


      if (!printRow) {
        await slowCon.rollback();
        return res.status(400).json({ error: `Print con slug '${item.slug}' non trovata` });
      }

      if (printRow.stock < item.quantity_req) {
        await slowCon.rollback();
        return res.status(400).json({ error: `Disponibilità insufficiente per '${item.slug}'` });
      }
    }

    // 2. Crea ordine
    const [orderResult] = await slowCon.query(
      `INSERT INTO orders (
        full_name, mail, phone_number,
        billing_address, shipping_address, order_status,
        payment_intent_id,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [full_name, mail, phone_number, billing_address, shipping_address, order_status, payment_intent_id]
    );

    const orderId = orderResult.insertId;
    let total = 0;
    let orderItemsHtml = '';
    let orderItemsText = '';

    // 3. Gestione articoli + sconti + stock
    for (const item of prints) {
      const [[printRow]] = await slowCon.query(
        "SELECT id, name, price, discount,stock, img_url FROM prints WHERE slug = ?",
        [item.slug]
      );
      console.log("printRow:", printRow);


      const price = parseFloat(printRow.price) || 0;
      const discount = parseFloat(printRow.discount) || 0;

      const finalPrice = discount > 0
        ? price - (price * discount) / 100
        : price;

      const subtotal = finalPrice * item.quantity_req;
      total += subtotal;

      let discountValue = 0;

      if (discount_code) {
        const [[discountRow]] = await slowCon.query(
          `SELECT discount_value FROM discount_codes
           WHERE code = ? AND validity = 1 AND NOW() BETWEEN valid_from AND valid_until`,
          [discount_code]
        );

        if (discountRow) {
          discountValue = parseFloat(discountRow.discount_value) || 0;
          total -= (total * discountValue) / 100;

          await slowCon.query(
            `UPDATE discount_codes
             SET used_count = used_count + 1, update_at = NOW()
             WHERE code = ?`,
            [discount_code]
          );
        }
      }

      await slowCon.query(
        `INSERT INTO order_print (
          id_print, slug, id_order, quantity_req, created_at, updated_at
        ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [printRow.id, item.slug, orderId, item.quantity_req]
      );

      await slowCon.query(
        "UPDATE prints SET stock = stock - ? WHERE id = ?",
        [item.quantity_req, printRow.id]
      );

   orderItemsHtml += `
  <li style="margin-bottom:10px;">
    <img src="${baseUrl}/images/prints/${printRow.img_url}" 
         alt="${printRow.name}" 
         style="width:150px;height:auto;vertical-align:middle;margin-right:10px;border-radius:4px;border:1px solid #ddd;" />
    <strong>${printRow.name}</strong> - Qty: ${item.quantity_req} - Prezzo: €${finalPrice.toFixed(2)}
  </li>
`;


      orderItemsText += `- ${printRow.name} x${item.quantity_req} - €${finalPrice.toFixed(2)}\n`;
    


    // 4. Salva il prezzo totale
    await slowCon.query(
      "UPDATE orders SET total_price = ? WHERE id = ?",
      [total.toFixed(2), orderId]
    );

    await slowCon.commit();

    // 5. Email
    const subject = 'Conferma Ordine';
    const htmlContent = `
      <h1>Ciao ${full_name},</h1>
      <p>Grazie per il tuo ordine #${orderId}!</p>
      <p>Qui il tuo riepilogo ordine:</p>
      <ul>${orderItemsHtml}</ul>
      <p><strong>Totale ordine: €${total.toFixed(2)}</strong></p>
      <p>Ti informeremo quando sarà spedito.</p>
    `;

    const textContent = `
Ciao ${full_name}, grazie per il tuo ordine #${orderId}!

Riepilogo ordine:
${orderItemsText}

Totale: €${total.toFixed(2)}

Ti informeremo quando sarà spedito.
    `;

    const adminEmail = process.env.ADMINEMAIL;
    const adminSubject = `Nuovo ordine ricevuto #${orderId}`;
    const adminHtmlContent = `
      <h1>Nuovo ordine ricevuto</h1>
      <p>Cliente: ${full_name} (${mail})</p>
      <p>Riepilogo ordine:</p>
      <ul>${orderItemsHtml}</ul>
      <p><strong>Totale ordine: €${total.toFixed(2)}</strong></p>
    `;
    const adminTextContent = `
Nuovo ordine ricevuto
Cliente: ${full_name} (${mail})

Riepilogo ordine:
${orderItemsText}

Totale: €${total.toFixed(2)}
    `;

try {
  await sendTestEmail(mail, subject, htmlContent, textContent);
  console.log("✅ Email inviata al cliente:", mail);
} catch (err) {
  console.error("❌ Errore email cliente:", err);
}

try {
  await sendTestEmail(adminEmail, adminSubject, adminHtmlContent, adminTextContent);
  console.log("✅ Email inviata all’admin:", adminEmail);
} catch (err) {
  console.error("❌ Errore email admin:", err);
}


    res.status(201).json({
      message: "Ordine creato e email inviate",
      order_id: orderId,
      total_price: total.toFixed(2)
    });
  }

  } catch (error) {
    await slowCon.rollback();
    console.error("Errore nella creazione dell'ordine:", error);
    res.status(500).json({ error: error.message });
  }
};


// DELETE ordine
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  try {
    await slowCon.beginTransaction();

    await slowCon.query("DELETE FROM order_print WHERE id_order = ?", [orderId]);
    const [result] = await slowCon.query("DELETE FROM orders WHERE id = ?", [orderId]);

    if (result.affectedRows === 0) {
      await slowCon.rollback();
      return res.status(404).json({ error: "Ordine non trovato" });
    }

    await slowCon.commit();
    res.json({ message: "Ordine cancellato correttamente", order_id: orderId });
  } catch (error) {
    await slowCon.rollback();
    res.status(500).json({ error: error.message });
  }
};

export default {
  getAllOrders,
  createOrder,
  deleteOrder
};
