import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  studentSignUp,
  studentSignIn,
  facultySignUp,
  facultySignIn,
} from "./routes/auth";
import {
  generateTimetableHandler,
  exportTimetablePDF,
  exportTimetableExcel,
} from "./routes/faculty";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/student/signup", studentSignUp);
  app.post("/api/auth/student/login", studentSignIn);
  app.post("/api/auth/faculty/signup", facultySignUp);
  app.post("/api/auth/faculty/login", facultySignIn);

  // Faculty routes
  app.post("/api/faculty/generate-timetable", generateTimetableHandler);
  app.post("/api/faculty/export-pdf", exportTimetablePDF);
  app.post("/api/faculty/export-excel", exportTimetableExcel);

  return app;
}
