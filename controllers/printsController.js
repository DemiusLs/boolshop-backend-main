import connection from "../db.js";
import imagePath from "../middlewares/imagePath.js";

//GET INDEX get all printas
const getAllPrints = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countSql = "SELECT COUNT(*) AS total FROM prints";
  const dataSql = "SELECT * FROM prints LIMIT ? OFFSET ?";

  connection.query(countSql, (error, countResult) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    connection.query(dataSql, [limit, offset], (error, dataResult) => {
      if (error) return res.status(500).json({ error: error.message })

      const prints = dataResult.map(print => ({
        ...print,
        img_url: `${req.imagePath}/${print.img_url}`,  // Corretto con backtick
      }));

  res.json({
    page,
    limit,
    total,
    totalPages,
    data: prints
  });
})
   
  });
}


//GET SHOW get single prints
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