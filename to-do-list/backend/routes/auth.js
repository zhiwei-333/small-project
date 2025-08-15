import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

const router = express.Router();

const refreshTokens = new Set();
const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2m", // 5 minutes
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // 7 days
  });

  const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true on HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/", // cookie available to all routes
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, gender, profilePic } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      gender: gender || null,
      profilePic: profilePic || null,
    });

    // const token = generateToken(user._id);
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.add(refreshToken);
    setRefreshCookie(res, refreshToken);

    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    res.status(201).json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // const token = generateToken(user._id);

    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.add(refreshToken);
    setRefreshCookie(res, refreshToken);

    res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        profilePic: user.profilePic,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", (req, res) => {
  const token = req.cookies?.refreshToken;
  console.log("Logging out user, token:", token);
  if (token) refreshTokens.delete(token);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  return res.json({ message: "Logged out successfully" });
});

router.post("/refresh", async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    // Check in DB
    const storedToken = await RefreshToken.findOne({ token });
    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token invalid" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
      if (err) {
        await RefreshToken.deleteOne({ token });
        return res.status(403).json({ message: "Refresh token expired/invalid" });
      }

      const user = await User.findById(payload.id);
      if (!user) {
        await RefreshToken.deleteOne({ token });
        return res.status(403).json({ message: "User no longer exists" });
      }

      // Rotate refresh token
      await RefreshToken.deleteOne({ token });
      const newRefreshToken = await generateRefreshToken(user);
      setRefreshCookie(res, newRefreshToken);

      // Create new access token
      const accessToken = generateAccessToken(user);
      return res.json({ accessToken });
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});

export default router;