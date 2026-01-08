const adminOnly = (req, res, next) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};

export default adminOnly;
