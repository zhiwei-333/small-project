import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Extract token from Authorization header or cookies
    let token;

    // Priority: Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      // Fallback to cookie
      token = req.cookies.jwt;
    }

    if (!token) {
      console.log("No token provided in header or cookie");
      return res.status(401).json({ message: "No token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      console.log("Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find user by ID
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      console.log("User not found in Middleware");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const authenticateToken = async (req, res, next) => {
//   try {
//     // Get token from header
//     const authHeader = req.header("Authorization");
//     const token = authHeader && authHeader.replace("Bearer ", "");

//     if (!token) {
//       return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

//     // Get user from token
//     const user = await User.findById(decoded.userId).select("-password");
//     if (!user) {
//       return res.status(401).json({ message: "Invalid token. User not found." });
//     }

//     // Add user to request object
//     req.user = user;
//     next();
//   } catch (error) {
//     if (error.name === "JsonWebTokenError") {
//       return res.status(401).json({ message: "Invalid token." });
//     }
//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Token expired." });
//     }
//     res.status(500).json({ message: "Server error during authentication." });
//   }
// };
