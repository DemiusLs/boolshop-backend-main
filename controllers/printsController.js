import connection from "../db.js";

const getAllPrints = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const offset = (page - 1) * limit;

  const countSql = "SELECT COUNT(*) AS total FROM prints";
  const dataSql = "SELECT * FROM prints LIMIT ? OFFSET ?";

  connection.query(countSql, (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    connection.query(dataSql, [limit, offset], (err, dataResult) => {
      if (err) return res.status(500).json({ error: err.message });

      const prints = dataResult.map(print => ({
        ...print,
          img_url: `${req.imagePath}/${print.img_url}`,
      }));

      res.json({
        page,
        limit,
        total,
        totalPages,
        data: prints
      });
    });
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
