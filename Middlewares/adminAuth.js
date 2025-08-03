import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({
        success: false,
        message: "Not Authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    const { isAdmin } = decoded;
    console.log(isAdmin);

    if (!isAdmin) {
      return res.json({
        success: false,
        message: "Not Authorized, try again 22.",
      });
    }

    next();
  } catch (error) {
    console.log("Admin Auth Error", error);
    res.json({
      success: false,
      message: error?.message,
    });
  }
};

export default adminAuth;
