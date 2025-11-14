import { RequestHandler } from "express";
import { generateTimetable } from "../utils/timetable-generator";
import { TimetableGenerationRequest } from "@shared/api";

export const generateTimetableHandler: RequestHandler = (req, res) => {
  try {
    const { settings, courses, resources, constraints } = req.body;

    // Validate input
    if (!settings || !courses || courses.length === 0 || !resources) {
      return res.status(400).json({
        error: "Missing required fields: settings, courses, resources",
      });
    }

    // Handle both formats: array and object
    let classroomCount = 5;
    let labCount = 2;

    if (Array.isArray(resources)) {
      // Format: [{ type: "classroom", count: X }, { type: "lab", count: Y }]
      classroomCount =
        resources.find((r: any) => r.type === "classroom")?.count || 5;
      labCount = resources.find((r: any) => r.type === "lab")?.count || 2;
    } else if (typeof resources === "object") {
      // Format: { classrooms: X, labs: Y }
      classroomCount = resources.classrooms || 5;
      labCount = resources.labs || 2;
    }

    // Generate timetable
    const timetable = generateTimetable(
      settings,
      courses,
      {
        classrooms: classroomCount,
        labs: labCount,
      },
      constraints || ""
    );

    if (timetable.length === 0) {
      return res.status(400).json({
        error: "Could not generate timetable with the given constraints",
      });
    }

    res.json({
      success: true,
      timetable,
      stats: {
        totalSlots: timetable.length,
        days: [...new Set(timetable.map((t) => t.day))].length,
        courses: [...new Set(timetable.map((t) => t.courseId))].length,
      },
    });
  } catch (error) {
    console.error("Error generating timetable:", error);
    res.status(500).json({ error: "Failed to generate timetable" });
  }
};

export const exportTimetablePDF: RequestHandler = (req, res) => {
  try {
    const { timetable, settings, courseName, instituteName } = req.body;

    // Basic PDF generation (in production, use a library like pdfkit)
    // For now, return a placeholder
    const csvContent = [
      [`Institute: ${instituteName || "ClassCanvas"}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [""],
      ["Day", "Time", "Course", "Code", "Instructor", "Room", "Type"],
      ...timetable.map(
        (slot: {
          day: string;
          startTime: string;
          endTime: string;
          courseName: string;
          courseCode: string;
          instructorName: string;
          resourceId: number;
          isLab: boolean;
        }) => [
          slot.day,
          `${slot.startTime} - ${slot.endTime}`,
          slot.courseName,
          slot.courseCode,
          slot.instructorName,
          `${slot.isLab ? "Lab" : "Classroom"} ${slot.resourceId}`,
          slot.isLab ? "Lab" : "Lecture",
        ]
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="timetable_${Date.now()}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting timetable:", error);
    res.status(500).json({ error: "Failed to export timetable" });
  }
};

export const exportTimetableExcel: RequestHandler = (req, res) => {
  try {
    const { timetable } = req.body;

    // In production, use a library like exceljs
    const csvContent = [
      ["Day", "Time", "Course", "Instructor", "Room"],
      ...timetable.map(
        (slot: {
          day: string;
          startTime: string;
          courseName: string;
          instructorName: string;
          resourceId: number;
        }) => [
          slot.day,
          slot.startTime,
          slot.courseName,
          slot.instructorName,
          slot.resourceId,
        ]
      ),
    ]
      .map((row) => row.join(","))
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="timetable_excel_${Date.now()}.csv"`
    );
    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting to excel:", error);
    res.status(500).json({ error: "Failed to export timetable" });
  }
};
