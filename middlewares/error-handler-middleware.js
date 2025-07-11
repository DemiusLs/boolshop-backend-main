function errorHandler (err, req, res, next) {
    
    res.status(500).json({
        error: "Errore nel server"
    })
}

export default errorHandler;