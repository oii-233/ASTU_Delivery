import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role: requestedRole } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCount = await User.countDocuments();
    let role: string;

    if (userCount === 0) {
      role = "superadmin";
    } else if (requestedRole === "admin") {
      role = "admin";
    } else {
      role = "user";
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      message: "User registered successfully",
      role: user.role
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    res.status(200).json({
      message: "Login successful",
      role: user.role
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = (_: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

export const me = (_: Request, res: Response) => {
  // `protect` middleware attaches `user` to req when token is valid
  // If this route is reached, user is authenticated
  // @ts-ignore
  const role = _.user?.role;
  if (!role) return res.status(401).json({ message: "Not authenticated" });
  return res.status(200).json({ role });
};
