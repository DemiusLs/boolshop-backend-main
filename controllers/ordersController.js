import db from "../db.js";

// GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {

  console.log("⚡ createOrder chiamato");

  const {
    full_name,
    mail,
    phone_number,
    total_price,
    billing_address,
    shipping_address,
    order_status,
    prints // array di oggetti: [{ id_print: X, quantity_req: Y }]
  } = req.body;


  console.log("REQ.BODY:", req.body);

  // VALIDAZIONE BASE
  if (!Array.isArray(prints)) {
     console.log("Errore: prints non è un array", prints);
    return res.status(400).json({ error: "'la stampa' deve essere un array" });
  }

  console.log("✅ Tipo di prints:", typeof prints);
console.log("✅ È array?", Array.isArray(prints));

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders (full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status]
    );

    const orderId = orderResult.insertId;

    for (const item of prints) {
      if (!item.id_print || !item.quantity_req) {
        await conn.rollback();
        return res.status(400).json({ error: "Each print must have 'id_print' and 'quantity_req'" });
      }

      await conn.query(
        `INSERT INTO order_print (id_print, id_order, quantity_req, created_at, updated_at)
         VALUES (?, ?, ?, NOW(), NOW())`,
        [item.id_print, orderId, item.quantity_req]
      );
    }

    await conn.commit();
    res.status(201).json({ message: "Order created", order_id: orderId });

  } catch (error) {
    await conn.rollback();
    
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};

// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  const orderId = req.params.id;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `DELETE FROM orders WHERE id = ?`,
      [orderId]
    );

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: "Ordine non trovato" });
    }

    await conn.commit();
    res.json({ message: "Ordine cancellato correttamente", order_id: orderId });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
};


export default { getAllOrders, createOrder, deleteOrder };
