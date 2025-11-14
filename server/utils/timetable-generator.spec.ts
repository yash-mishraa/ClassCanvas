import { describe, it, expect } from "vitest";
import { generateTimetable, parseConstraints } from "./timetable-generator";

describe("Timetable Generator", () => {
  const defaultSettings = {
    dayStartTime: "08:00",
    dayEndTime: "17:00",
    lunchStartTime: "12:00",
    lunchEndTime: "13:00",
    defaultLectureDuration: 60,
  };

  const defaultResources = {
    classrooms: 5,
    labs: 2,
  };

  describe("generateTimetable", () => {
    it("should generate timetable with valid courses", () => {
      const courses = [
        {
          id: "course1",
          name: "Data Structures",
          code: "CS201",
          instructorName: "Dr. Smith",
          lecturesPerWeek: 3,
          isLab: false,
          lectureDuration: 60,
        },
      ];

      const timetable = generateTimetable(
        defaultSettings,
        courses,
        defaultResources,
        ""
      );

      expect(timetable.length).toBeGreaterThan(0);
      expect(timetable.every((slot) => slot.courseId === "course1")).toBe(
        true
      );
    });

    it("should not exceed lectures per week", () => {
      const courses = [
        {
          id: "course1",
          name: "Data Structures",
          code: "CS201",
          instructorName: "Dr. Smith",
          lecturesPerWeek: 2,
          isLab: false,
          lectureDuration: 60,
        },
      ];

      const timetable = generateTimetable(
        defaultSettings,
        courses,
        defaultResources,
        ""
      );

      const courseSlots = timetable.filter((slot) => slot.courseId === "course1");
      expect(courseSlots.length).toBeLessThanOrEqual(2);
    });

    it("should allocate labs and classrooms correctly", () => {
      const courses = [
        {
          id: "course1",
          name: "Programming",
          code: "CS101",
          instructorName: "Dr. John",
          lecturesPerWeek: 2,
          isLab: false,
          lectureDuration: 60,
        },
        {
          id: "course2",
          name: "Lab",
          code: "CS102",
          instructorName: "Dr. Jane",
          lecturesPerWeek: 2,
          isLab: true,
          lectureDuration: 120,
        },
      ];

      const timetable = generateTimetable(
        defaultSettings,
        courses,
        defaultResources,
        ""
      );

      const lectureSlots = timetable.filter((slot) => !slot.isLab);
      const labSlots = timetable.filter((slot) => slot.isLab);

      lectureSlots.forEach((slot) => {
        expect(slot.resourceType).toBe("classroom");
      });

      labSlots.forEach((slot) => {
        expect(slot.resourceType).toBe("lab");
      });
    });

    it("should not schedule during lunch time", () => {
      const courses = [
        {
          id: "course1",
          name: "Data Structures",
          code: "CS201",
          instructorName: "Dr. Smith",
          lecturesPerWeek: 5,
          isLab: false,
          lectureDuration: 60,
        },
      ];

      const timetable = generateTimetable(
        defaultSettings,
        courses,
        defaultResources,
        ""
      );

      timetable.forEach((slot) => {
        const startTime = parseInt(slot.startTime.split(":")[0]);
        const endTime = parseInt(slot.endTime.split(":")[0]);

        // Should not overlap with lunch (12:00-13:00)
        expect(!(startTime < 13 && endTime > 12)).toBe(true);
      });
    });

    it("should respect resource limits", () => {
      const courses = [
        {
          id: "course1",
          name: "Course1",
          code: "C1",
          instructorName: "Dr. A",
          lecturesPerWeek: 5,
          isLab: false,
        },
        {
          id: "course2",
          name: "Course2",
          code: "C2",
          instructorName: "Dr. B",
          lecturesPerWeek: 5,
          isLab: false,
        },
      ];

      const resources = { classrooms: 2, labs: 1 };
      const timetable = generateTimetable(
        defaultSettings,
        courses,
        resources,
        ""
      );

      // Count classroom usage by day and time
      const classroomUsage: Record<string, Set<string>> = {};
      timetable.forEach((slot) => {
        if (slot.resourceType === "classroom") {
          const key = `${slot.day}-${slot.startTime}`;
          if (!classroomUsage[key]) {
            classroomUsage[key] = new Set();
          }
          classroomUsage[key].add(slot.resourceId.toString());
        }
      });

      // Verify no more than 2 classrooms used at same time
      Object.values(classroomUsage).forEach((usedRooms) => {
        expect(usedRooms.size).toBeLessThanOrEqual(2);
      });
    });
  });

  describe("parseConstraints", () => {
    it("should parse time-based constraints", () => {
      const text = "no classes after 3:00 PM";
      const constraints = parseConstraints(text);

      expect(constraints.some((c) => c.type === "no_after")).toBe(true);
    });

    it("should parse lunch constraints", () => {
      const text = "Respect lunch break between 12 and 1";
      const constraints = parseConstraints(text);

      expect(constraints.some((c) => c.type === "respect_lunch")).toBe(true);
    });

    it("should parse consecutive lab constraints", () => {
      const text = "Labs must be scheduled consecutively";
      const constraints = parseConstraints(text);

      expect(constraints.some((c) => c.type === "consecutive_labs")).toBe(true);
    });

    it("should parse morning preference constraints", () => {
      const text = "Morning classes preferred for core subjects";
      const constraints = parseConstraints(text);

      expect(constraints.some((c) => c.type === "morning_preferred")).toBe(true);
    });

    it("should parse instructor availability constraints", () => {
      const text = "Professor Smith unavailable Thursday";
      const constraints = parseConstraints(text);

      expect(
        constraints.some(
          (c) => c.type === "instructor_unavailable" && c.value.includes("Smith")
        )
      ).toBe(true);
    });
  });
});

describe("Attendance Calculations", () => {
  it("should calculate attendance percentage correctly", () => {
    const totalLectures = 40;
    const attendedLectures = 30;
    const percentage = (attendedLectures / totalLectures) * 100;

    expect(percentage).toBe(75);
  });

  it("should calculate classes needed to reach target", () => {
    const totalLectures = 40;
    const attendedLectures = 30;
    const targetPercentage = 80;

    const classesNeeded = Math.ceil(
      (targetPercentage * totalLectures) / 100 - attendedLectures
    );

    expect(classesNeeded).toBe(2);
  });

  it("should calculate classes that can be missed", () => {
    const totalLectures = 40;
    const attendedLectures = 35;
    const targetPercentage = 75;

    const classesMissable = Math.floor(
      attendedLectures - (targetPercentage * totalLectures) / 100
    );

    expect(classesMissable).toBe(5);
  });

  it("should handle edge cases for attendance", () => {
    // No lectures attended
    const percentage1 = (0 / 40) * 100;
    expect(percentage1).toBe(0);

    // All lectures attended
    const percentage2 = (40 / 40) * 100;
    expect(percentage2).toBe(100);

    // Single lecture
    const percentage3 = (1 / 1) * 100;
    expect(percentage3).toBe(100);
  });
});
