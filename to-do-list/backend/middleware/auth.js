import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
      // Optional: allow accessToken in cookies
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "No access token" });
    }

    // Verify access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    // Check user still exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protectRoute = async (req, res, next) => {
//   try {
//     // Extract token from Authorization header or cookies
//     let token;

//     // Priority: Authorization header
//     if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer ")
//     ) {
//       token = req.headers.authorization.split(" ")[1];
//     } else if (req.cookies?.jwt) {
//       // Fallback to cookie
//       token = req.cookies.jwt;
//     }

//     if (!token) {
//       console.log("No token provided in header or cookie");
//       return res.status(401).json({ message: "No token" });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (!decoded || !decoded.id) {
//       console.log(decoded);
//       console.log("Invalid token");
//       return res.status(401).json({ message: "Invalid token" });
//     }
//     console.log("Decoded token:", decoded);
//     var userIdDecoded = decoded.id;

//     // Find user by ID
//     const user = await User.findById(userIdDecoded).select("-password");
//     if (!user) {
//       console.log("User not found in Middleware");
//       return res.status(401).json({ message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (err) {
//     console.error("Auth middleware error:", err.message);
//     return res.status(401).json({ message: "Unauthorized" });
//   }
// };
