function routeNotMiddleware (req, res, next) {
    res.status(404).json({
        error: "rotta non trovata"
    })
}

export default routeNotMiddleware;