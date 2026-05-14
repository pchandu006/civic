const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* VERIFY TOKEN */

const protect = async (req, res, next) => {

  try {

    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id)
        .select("-password")
        .lean();

      next();

    } else {
      return res.status(401).json({
        message: "Not authorized ❌"
      });
    }

  } catch (error) {

    return res.status(401).json({
      message: "Token failed ❌"
    });

  }

};


/* OFFICER ROLE CHECK */

const officerOnly = (req, res, next) => {

  if (req.user && req.user.role === "officer") {
    next();
  } else {
    return res.status(403).json({
      message: "Access denied ❌ Officer only"
    });
  }

};

module.exports = { protect, officerOnly };