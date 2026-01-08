const blockBannedProvider = (req, res, next) => {
  if (!req.provider) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.provider.isBanned) {
    return res.status(403).json({
      message: "Your account is restricted by admin",
    });
  }

  next();
};

export default blockBannedProvider;
