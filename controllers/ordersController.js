import connection from "../db.js";


const getAllOrders = (req, res) => {
  connection.query("SELECT * FROM orders", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
};

// POST create order
const createOrder = (req, res) => {
  console.log("POST /orders body:", req.body);  // <--- debug
  const {
    full_name,
    mail,
    phone_number,
    total_price,
    billing_address,
    shipping_address,
    order_status,
    prints // array di oggetti [{ id_print, quantity_req }]
  } = req.body;

  if (!Array.isArray(prints)) {
    console.log("Errore: prints non è un array");
    return res.status(400).json({ error: "'prints' deve essere un array" });
  }

  // Prima prendi una connessione dal pool
  connection.getConnection((err, conn) => {
    if (err) {
      console.log("Errore beginTransaction:", err);
      return res.status(500).json({ error: err.message });
    }

    // Inizia la transazione
    conn.beginTransaction((err) => {
      if (err) {
        conn.release();
        console.log("Errore inserimento ordine:", err);
        return res.status(500).json({ error: err.message });
      }

      // Inserisci l'ordine
      const orderSql = `INSERT INTO orders 
        (full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

      conn.query(orderSql,
        [full_name, mail, phone_number, total_price, billing_address, shipping_address, order_status],
        (err, orderResult) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              res.status(500).json({ error: err.message });
            });
          }

          const orderId = orderResult.insertId;
          console.log("Inserito ordine id:", orderId);

          // Funzione ricorsiva per inserire ogni print (per evitare callback troppo annidati)
          const insertPrints = (index) => {
            if (index >= prints.length) {
              // Tutto inserito, conferma transazione
              return conn.commit((err) => {
                conn.release();
                if (err) {
                  console.log("Errore commit:", err);
                  return res.status(500).json({ error: err.message });
                }
                console.log("Ordine creato con successo");
                res.status(201).json({ message: "Order created", order_id: orderId });
              });
            }

            const item = prints[index];
            console.log("Inserisco print", index, item);

            if (!item.id_print || !item.quantity_req) {
              return conn.rollback(() => {
                conn.release();
                res.status(400).json({ error: "Each print must have 'id_print' and 'quantity_req'" });
              });
            }

            const printSql = `INSERT INTO order_print (id_print, id_order, quantity_req, created_at, updated_at)
                              VALUES (?, ?, ?, NOW(), NOW())`;

            conn.query(printSql, [item.id_print, orderId, item.quantity_req], (err) => {
              if (err) {
                console.log("Errore inserimento print:", err);
                return conn.rollback(() => {
                  conn.release();
                  res.status(500).json({ error: err.message });
                });
              }
              // Passa al prossimo item
              insertPrints(index + 1);
            });
          };

          insertPrints(0);
        }
      );
    });
  });
};

//DELETE cancellare ordine
const deleteOrder = (req, res) => {
  const orderId = req.params.id;

  connection.getConnection((err, conn) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    conn.beginTransaction((err) => {
      if (err) {
        conn.release();
        return res.status(500).json({ error: err.message });
      }

      conn.query("DELETE FROM order_print WHERE id_order = ?", [orderId], (err) => {
        if (err) {
          return conn.rollback(() => {
            conn.release();
            res.status(500).json({ error: err.message });
          });
        }

        conn.query("DELETE FROM orders WHERE id = ?", [orderId], (err, result) => {
          if (err) {
            return conn.rollback(() => {
              conn.release();
              res.status(500).json({ error: err.message });
            });
          }

          if (result.affectedRows === 0) {
            return conn.rollback(() => {
              conn.release();
              res.status(404).json({ error: "Ordine non trovato" });
            });
          }

          conn.commit((err) => {
            conn.release();
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.json({ message: "Ordine cancellato correttamente", order_id: orderId });
          });
        });
      });
    });
  });
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

//   const conn = await connection.getConnection();
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
