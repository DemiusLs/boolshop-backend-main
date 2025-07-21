export default function errorHandler(err, req, res, next) {
  console.error("ERRORE GESTITO:", err);

  res.status(500).json({
    message: "Errore interno del server.",
    error: err.message,
  });
}