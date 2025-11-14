import { RequestHandler } from "express";
import {
  AuthRequest,
  StudentSignUpRequest,
  FacultySignUpRequest,
  AuthResponse,
  ErrorResponse,
} from "@shared/api";

// Mock database for demo purposes
// In production, use actual database with hashed passwords
const users: Map<
  string,
  {
    id: string;
    email: string;
    password: string;
    role: "student" | "faculty";
    departmentCode?: string;
  }
> = new Map();

// Simple JWT-like token generation (in production, use jsonwebtoken)
function generateToken(email: string, role: string): string {
  return Buffer.from(`${email}:${role}:${Date.now()}`).toString("base64");
}

// Student sign up
export const studentSignUp: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as StudentSignUpRequest;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" } as ErrorResponse);
    }

    if (users.has(email)) {
      return res.status(400).json({ error: "Email already registered" } as ErrorResponse);
    }

    const userId = `student_${Date.now()}`;
    users.set(email, {
      id: userId,
      email,
      password, // In production, hash this!
      role: "student",
    });

    const token = generateToken(email, "student");
    return res.status(201).json({
      token,
      user: { id: userId, email, role: "student" },
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" } as ErrorResponse);
  }
};

// Student sign in
export const studentSignIn: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as AuthRequest;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" } as ErrorResponse);
    }

    const user = users.get(email);
    if (!user || user.role !== "student" || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" } as ErrorResponse);
    }

    const token = generateToken(email, "student");
    return res.json({
      token,
      user: { id: user.id, email, role: "student" },
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" } as ErrorResponse);
  }
};

// Faculty sign up
export const facultySignUp: RequestHandler = (req, res) => {
  try {
    const { email, password, departmentCode } = req.body as FacultySignUpRequest;

    if (!email || !password || !departmentCode) {
      return res.status(400).json({ error: "All fields required" } as ErrorResponse);
    }

    if (users.has(email)) {
      return res.status(400).json({ error: "Email already registered" } as ErrorResponse);
    }

    const userId = `faculty_${Date.now()}`;
    users.set(email, {
      id: userId,
      email,
      password, // In production, hash this!
      role: "faculty",
      departmentCode,
    });

    const token = generateToken(email, "faculty");
    return res.status(201).json({
      token,
      user: { id: userId, email, role: "faculty" },
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" } as ErrorResponse);
  }
};

// Faculty sign in
export const facultySignIn: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body as AuthRequest;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" } as ErrorResponse);
    }

    const user = users.get(email);
    if (!user || user.role !== "faculty" || user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" } as ErrorResponse);
    }

    const token = generateToken(email, "faculty");
    return res.json({
      token,
      user: { id: user.id, email, role: "faculty" },
    } as AuthResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" } as ErrorResponse);
  }
};
