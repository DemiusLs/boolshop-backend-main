import connection from "../db.js";
import { sendTestEmail } from "../emailService.js";

const slowCon = connection.promise()

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
    prints
  } = req.body;

  if (!Array.isArray(prints)) {
    return res.status(400).json({ error: "'prints' deve essere un array" });
  }

  try {
    await slowCon.beginTransaction();

    // 1. Crea l’ordine senza total_price
    const [orderResult] = await slowCon.query(
      `INSERT INTO orders (
        full_name, mail, phone_number,
        billing_address, shipping_address, order_status,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [full_name, mail, phone_number, billing_address, shipping_address, order_status]
    );

    const orderId = orderResult.insertId;

    // 2. Variabili per calcolo totale e email
    let total = 0;
    let orderItemsHtml = '';
    let orderItemsText = '';

    for (const item of prints) {
      if (!item.slug || !item.quantity_req) {
        await slowCon.rollback();
        return res.status(400).json({ error: "Ogni print deve avere 'slug' e 'quantity_req'" });
      }

      const [[printRow]] = await slowCon.query(
        `SELECT id, name, price, discount, stock FROM prints WHERE slug = ?`,
        [item.slug]
      );

      if (!printRow) {
        await slowCon.rollback();
        return res.status(400).json({ error: `Print con slug '${item.slug}' non trovata` });
      }

      if (printRow.stock < item.quantity_req) {
        await slowCon.rollback();
        return res.status(400).json({ error: `Disponibilità insufficiente per '${printRow.name}'` });
      }

      const finalPrice = printRow.discount
        ? printRow.price - (printRow.price * printRow.discount) / 100
        : printRow.price;

      total += finalPrice * item.quantity_req;

      await slowCon.query(
        `INSERT INTO order_print (
          id_print, slug, id_order, quantity_req, created_at, updated_at
        ) VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [printRow.id, item.slug, orderId, item.quantity_req]
      );

      orderItemsHtml += `<li>${printRow.name} - Qty: ${item.quantity_req} - Prezzo: €${finalPrice.toFixed(2)}</li>`;
      orderItemsText += `- ${printRow.name} x${item.quantity_req} - €${finalPrice.toFixed(2)}\n`;
    }

    // 3. Salva total_price nel DB
    await slowCon.query(
      `UPDATE orders SET total_price = ? WHERE id = ?`,
      [total.toFixed(2), orderId]
    );

    await slowCon.commit();

    // 4. Invia email
    const subject = 'Conferma Ordine';
    const htmlContent = `
      <h1>Ciao ${full_name},</h1>
      <p>Grazie per il tuo ordine #${orderId}!</p>
      <p>Qui il tuo riepilogo ordine:</p>
      <ul>
        ${orderItemsHtml}
      </ul>
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

    await sendTestEmail(
      mail, subject, htmlContent, textContent,
      adminEmail, adminSubject, adminHtmlContent, adminTextContent
    );

    res.status(201).json({ message: "Ordine creato e email inviata", order_id: orderId });

  } catch (error) {
    await slowCon.rollback();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// DELETE ordine + prints associati
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

export default { getAllOrders, createOrder, deleteOrder };

