const imagePath = (req, res, next) => {
  req.imagePath = `${req.protocol}://${req.get("host")}/images/prints`;
  next();
};

export default imagePath;