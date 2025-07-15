import connection from "../db.js";

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
    total_price,
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

    const [orderResult] = await slowCon.query(
      `INSERT INTO orders (full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status]
    );

    const orderId = orderResult.insertId;

    for (const item of prints) {
      if (!item.slug || !item.quantity_req) {
        await slowCon.rollback();
        return res.status(400).json({ error: "Ogni print deve avere 'slug' e 'quantity_req'" });
      }

      const [[printRow]] = await slowCon.query(
        `SELECT id FROM prints WHERE slug = ?`,
        [item.slug]
       );

  if (!printRow) {
    await slowCon.rollback();
    return res.status(400).json({ error: `Print con slug '${item.slug}' non trovata` });
  }

      await slowCon.query(          
        `INSERT INTO order_print (id_print, slug, id_order, quantity_req, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [printRow.id , item.slug, orderId, item.quantity_req]
      );
    }

    await slowCon.commit();
    res.status(201).json({ message: "Order created", order_id: orderId });
  } catch (error) {
    await slowCon.rollback();
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






// import connection from "../db.js";

// // GET /api/orders
// const getAllOrders = async (req, res) => {
//   try {
//     const [rows] = await connection.query("SELECT * FROM orders");
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // POST /api/orders
// const createOrder = async (req, res) => {


//   const {
//     full_name,
//     mail,
//     phone_number,
//     total_price,
//     billing_address,
//     shipping_address,
//     order_status,
//     prints // array di oggetti: [{ id_print: X, quantity_req: Y }]
//   } = req.body;


//   console.log("REQ.BODY:", req.body);

//   // VALIDAZIONE BASE
//   if (!Array.isArray(prints)) {
//      console.log("Errore: prints non è un array", prints);
//     return res.status(400).json({ error: "'la stampa' deve essere un array" });
//   }

//   const conn = await connection.query();
//   try {
//     await conn.beginTransaction(); // beginTransaction è una funzione che dice da questo momento, tutte le operazioni che eseguirò saranno parte di una transazione unica. Finché non farò il commit o il rollback, nessuna modifica sarà definitiva."

//     const [orderResult] = await conn.query(
//       `INSERT INTO orders (full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status, created_at, updated_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//       [full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status]
//     );

//     const orderId = orderResult.insertId;

//     for (const item of prints) {
//       if (!item.id_print || !item.quantity_req) {
//         await conn.rollback(); // Annulla tutte le query fatte nella transazione
//         return res.status(400).json({ error: "Each print must have 'id_print' and 'quantity_req'" });
//       }

//       await conn.query(
//         `INSERT INTO order_print (id_print, id_order, quantity_req, created_at, updated_at)
//          VALUES (?, ?, ?, NOW(), NOW())`,
//         [item.id_print, orderId, item.quantity_req]
//       );
//     }

//     await conn.commit();// Conferma le modifiche se tutto è andato bene
//     res.status(201).json({ message: "Order created", order_id: orderId });

//   } catch (error) {
//     await conn.rollback(); // Annulla tutte le query fatte nella transazione
    
//     res.status(500).json({ error: error.message });
//   } finally {
//     conn.release();
//   }
// };

// // DELETE /api/orders/:id
// const deleteOrder = async (req, res) => {
//   const orderId = req.params.id;

//   const conn = await connection.getConnection();
//   try {
//     await conn.beginTransaction();

//     //Elimina prima le righe nella tabella ponte order_print
//     await conn.query(
//       `DELETE FROM order_print WHERE id_order = ?`,
//       [orderId]
//     );

//     // Poi elimina l'ordine
//     const [result] = await conn.query(
//       `DELETE FROM orders WHERE id = ?`,
//       [orderId]
//     );

//     if (result.affectedRows === 0) {
//       await conn.rollback();
//       return res.status(404).json({ error: "Ordine non trovato" });
//     }

//     await conn.commit();
//     res.json({ message: "Ordine cancellato correttamente", order_id: orderId });
//   } catch (error) {
//     await conn.rollback();
//     res.status(500).json({ error: error.message });
//   } finally {
//     conn.release();
//   }
// };


// export default { getAllOrders, createOrder, deleteOrder };
