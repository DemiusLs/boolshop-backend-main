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

export default { getAllOrders, createOrder };
