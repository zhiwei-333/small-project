import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const refreshTokens = new Set();

const generateAccessToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2m", // short-lived access token
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // long-lived refresh token
  });

const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.add(refreshToken);
    setRefreshCookie(res, refreshToken);

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
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    refreshTokens.add(refreshToken);
    setRefreshCookie(res, refreshToken);

    res.json({
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

// LOGOUT
router.post("/logout", (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) refreshTokens.delete(token);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });

  res.json({ message: "Logged out successfully" });
});

// REFRESH
router.post("/refresh", (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  if (!refreshTokens.has(token)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
    if (err) {
      refreshTokens.delete(token);
      return res.status(403).json({ message: "Refresh token expired/invalid" });
    }
    
    // Rotate token
    refreshTokens.delete(token);
    const user = { _id: payload.id, email: payload.email };
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.add(newRefreshToken);
    setRefreshCookie(res, newRefreshToken);

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  });
});

export default router;
