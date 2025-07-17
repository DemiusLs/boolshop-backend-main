import connection from "../db.js";
import imagePath from "../middlewares/imagePath.js";

//GET INDEX get all prints
const getAllPrints = (req, res) => {

  const { filter, id_genre, genre, search, sort } = req.query;

  let sql = `
    SELECT prints.*, genres.name AS genre_name
    FROM prints
    JOIN genres ON prints.id_genre = genres.id
  `;
  const conditions = [];
  const params = [];

  if (filter === "new") conditions.push("status = 1");
  if (filter === "sale") conditions.push("discount > 0");
  if (filter === "featured") conditions.push("is_featured = 1");
  if (id_genre) {
    conditions.push("prints.id_genre = ?");
    params.push(id_genre);
  }
  if (genre) {
    conditions.push("genres.name = ?");
    params.push(genre);
  }
  if (search) {
    conditions.push("prints.name LIKE ?");
    params.push(`%${search}%`);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  switch (sort) {
    case "price_asc":
      sql += " ORDER BY prints.price ASC";
      break;
    case "price_desc":
      sql += " ORDER BY prints.price DESC";
      break;
    default:
      sql += " ORDER BY prints.created_at DESC";
  }

  connection.query(sql, params, (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const prints = results.map((curPrint) => ({
      ...curPrint,
      img_url: `${req.imagePath}/${curPrint.img_url}`,
    }));

    res.json({ data: prints, count: prints.length });
/*
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
    data: prints */
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