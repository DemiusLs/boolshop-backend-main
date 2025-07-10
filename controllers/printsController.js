import db from "../db.js";

const getAllPrints = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM prints");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPrintBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.query("SELECT * FROM prints WHERE slug = ?", [slug]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Print not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { getAllPrints, getPrintBySlug };
