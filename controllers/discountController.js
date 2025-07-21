
import connection from "../db.js";


const slowCon = connection.promise()


// SHOW: restituisce un codice sconto valido per `code`
export const getDiscountByCode = async (req, res, next) => {
  const { code } = req.params;

  try {
    const [rows] = await slowCon.query(
      `SELECT * FROM discount_codes
       WHERE code = ?
       AND validity = 1
       AND NOW() BETWEEN valid_from AND valid_until`,
      [code]
    );

    if (rows.length === 0) {
      // Rispondi con 200 e un oggetto che indica codice non valido
      return res.json({ valid: false, message: "Codice sconto non valido o scaduto." });
    }

    // Se valido, ritorna i dati con valid: true
    return res.json({ valid: true, ...rows[0] });
  } catch (err) {
    next(err);
  }
};

// UPDATE: aggiorna used_count dato un ID
export const updateDiscountUsage = async (req, res, next) => {
  const { code } = req.params;

  try {
    const [result] = await slowCon.query(
      `UPDATE discount_codes
       SET used_count = used_count + 1,
           update_at = CURRENT_TIMESTAMP
       WHERE code = ?`,
      [code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Codice sconto non trovato." });
    }

    res.json({ message: "Utilizzo del codice aggiornato correttamente." });
  } catch (err) {
    next(err);
  }
};

// POST: crea un nuovo codice sconto
// controllers/discountController.js

export const createDiscountCode = async (req, res, next) => {
  const {
    code,
    description,
    discount_value,
    validity = 1,   // default a 1 se non inviato
    valid_from,
    valid_until,
  } = req.body;

  try {
    const [result] = await slowCon.query(
      `INSERT INTO discount_codes 
       (code, description, discount_value, validity, valid_from, valid_until) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [code, description, discount_value, validity, valid_from, valid_until]
    );

    res.status(201).json({ message: "Codice sconto creato con successo.", id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Codice sconto già esistente." });
    }
    next(err);
  }
};






// SELECT * FROM discount_codes
// WHERE code = ?
//   AND NOW() BETWEEN valid_from AND valid_until;