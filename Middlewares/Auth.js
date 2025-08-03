import jwt from "jsonwebtoken";

const ensureAuthenticated = (req, res, next) => {
  const auth = req.headers["authorization"];

  if (!auth) {
    return res.json({ message: "Unauthorized, JWT token is required" });
  }

  try {
    const decoded = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.json({ message: "Unauthorized, JWT token is wrong or expired" });
  }
};

export default ensureAuthenticated;
