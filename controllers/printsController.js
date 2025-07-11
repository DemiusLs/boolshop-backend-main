import connection from "../db.js";

const getAllPrints = (req, res) => {
  connection.query("SELECT * FROM prints", (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
};

const getPrintBySlug = (req, res) => {
  const { slug } = req.params;
  connection.query("SELECT * FROM prints WHERE slug = ?", [slug], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Stampa non trovata" });
    }
    res.json(results[0]);
  });
};

export default { getAllPrints, getPrintBySlug };









// import connection from "../db.js";

// const getAllPrints = async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM prints");
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const getPrintBySlug = async (req, res) => {
//   try {
//     const { slug } = req.params;
//     const [rows] = await connection.query("SELECT * FROM prints WHERE slug = ?", [slug]);
//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Print not found" });
//     }
//     res.json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// export default { getAllPrints, getPrintBySlug };
