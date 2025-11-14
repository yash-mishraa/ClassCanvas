/**
 * Timetable Generation Algorithm
 * Uses a greedy approach with constraint satisfaction
 */

interface CourseInstance {
  id: string;
  name: string;
  code: string;
  instructorName: string;
  lecturesPerWeek: number;
  isLab: boolean;
  lectureDuration?: number;
}

interface TimetableSettings {
  dayStartTime: string;
  dayEndTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  defaultLectureDuration: number;
}

interface Resource {
  type: "classroom" | "lab";
  count: number;
}

interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  instructorName: string;
  resourceType: "classroom" | "lab";
  resourceId: number;
  isLab: boolean;
}

interface Constraint {
  type: string;
  value: string;
}

// Parse constraints from natural language
function parseConstraints(text: string): Constraint[] {
  const constraints: Constraint[] = [];

  // Common patterns
  if (text.toLowerCase().includes("no classes after")) {
    const match = text.match(/no classes after (\d+):?(\d*)(?:\s*(?:pm|PM))?/i);
    if (match) {
      constraints.push({
        type: "no_after",
        value: `${match[1]}:${match[2] || "00"}`,
      });
    }
  }

  if (text.toLowerCase().includes("lunch")) {
    constraints.push({ type: "respect_lunch", value: "true" });
  }

  if (
    text.toLowerCase().includes("lab") &&
    text.toLowerCase().includes("consecutive")
  ) {
    constraints.push({ type: "consecutive_labs", value: "true" });
  }

  if (text.toLowerCase().includes("morning")) {
    constraints.push({ type: "morning_preferred", value: "true" });
  }

  if (text.toLowerCase().includes("unavailable")) {
    const match = text.match(
      /(?:professor|instructor)?\s*(\w+)\s+unavailable\s+(\w+)/i
    );
    if (match) {
      constraints.push({
        type: "instructor_unavailable",
        value: `${match[1]}:${match[2]}`,
      });
    }
  }

  return constraints;
}

// Check if a time slot is valid
function isValidTimeSlot(
  time: string,
  duration: number,
  dayStart: string,
  dayEnd: string,
  lunchStart: string,
  lunchEnd: string
): boolean {
  const [hour, minute] = time.split(":").map(Number);
  const slotStartMinutes = hour * 60 + minute;
  const slotEndMinutes = slotStartMinutes + duration;

  // Parse constraints
  const [dayStartHour, dayStartMin] = dayStart.split(":").map(Number);
  const [dayEndHour, dayEndMin] = dayEnd.split(":").map(Number);
  const [lunchStartHour, lunchStartMin] = lunchStart.split(":").map(Number);
  const [lunchEndHour, lunchEndMin] = lunchEnd.split(":").map(Number);

  const dayStartMinutes = dayStartHour * 60 + dayStartMin;
  const dayEndMinutes = dayEndHour * 60 + dayEndMin;
  const lunchStartMinutes = lunchStartHour * 60 + lunchStartMin;
  const lunchEndMinutes = lunchEndHour * 60 + lunchEndMin;

  // Check within day boundaries
  if (slotStartMinutes < dayStartMinutes || slotEndMinutes > dayEndMinutes) {
    return false;
  }

  // Check doesn't overlap with lunch
  if (
    !(slotEndMinutes <= lunchStartMinutes || slotStartMinutes >= lunchEndMinutes)
  ) {
    return false;
  }

  return true;
}

// Generate available time slots for a day
function generateAvailableSlots(
  settings: TimetableSettings,
  duration: number
): string[] {
  const slots: string[] = [];
  const [startHour, startMin] = settings.dayStartTime.split(":").map(Number);
  const [endHour, endMin] = settings.dayEndTime.split(":").map(Number);

  const dayStartMinutes = startHour * 60 + startMin;
  const dayEndMinutes = endHour * 60 + endMin;

  // Generate slots starting from actual day start time, in 15-minute increments
  for (let minutes = dayStartMinutes; minutes <= dayEndMinutes - duration; minutes += 15) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const timeStr = `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;

    if (
      isValidTimeSlot(
        timeStr,
        duration,
        settings.dayStartTime,
        settings.dayEndTime,
        settings.lunchStartTime,
        settings.lunchEndTime
      )
    ) {
      slots.push(timeStr);
    }
  }

  return slots;
}

// Main timetable generation function
export function generateTimetable(
  settings: TimetableSettings,
  courses: CourseInstance[],
  resources: { classrooms: number; labs: number },
  constraintsText: string
): TimeSlot[] {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timetable: TimeSlot[] = [];
  const constraints = parseConstraints(constraintsText);

  // Track resource usage
  const classroomUsage = new Map<
    string,
    Set<string>
  >();
  const labUsage = new Map<string, Set<string>>();

  days.forEach((day) => {
    classroomUsage.set(day, new Set());
    labUsage.set(day, new Set());
  });

  // Add lunch break slots to timetable
  days.forEach((day) => {
    timetable.push({
      day,
      startTime: settings.lunchStartTime,
      endTime: settings.lunchEndTime,
      courseId: "lunch_break",
      courseName: "Lunch Break",
      courseCode: "LUNCH",
      instructorName: "-",
      resourceType: "classroom",
      resourceId: 0,
      isLab: false,
    });
  });

  // Schedule courses
  for (const course of courses) {
    const duration =
      course.lectureDuration || settings.defaultLectureDuration;
    let lecturesScheduled = 0;

    for (const day of days) {
      if (lecturesScheduled >= course.lecturesPerWeek) break;

      const slots = generateAvailableSlots(settings, duration);

      for (const slot of slots) {
        if (lecturesScheduled >= course.lecturesPerWeek) break;

        const resourceType = course.isLab ? "lab" : "classroom";
        const resourceMap =
          resourceType === "lab" ? labUsage : classroomUsage;
        const maxResources =
          resourceType === "lab"
            ? resources.labs
            : resources.classrooms;

        const dayUsage = resourceMap.get(day) || new Set();

        // Find available resource
        let resourceId = -1;
        for (let i = 1; i <= maxResources; i++) {
          if (!dayUsage.has(`${slot}:${i}`)) {
            resourceId = i;
            break;
          }
        }

        if (resourceId > 0) {
          // Schedule the lecture
          const [startHour, startMin] = slot.split(":").map(Number);
          const endMinutes = startHour * 60 + startMin + duration;
          const endHour = Math.floor(endMinutes / 60);
          const endMin = endMinutes % 60;

          const endTime = `${endHour.toString().padStart(2, "0")}:${endMin
            .toString()
            .padStart(2, "0")}`;

          timetable.push({
            day,
            startTime: slot,
            endTime,
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            instructorName: course.instructorName,
            resourceType,
            resourceId,
            isLab: course.isLab,
          });

          dayUsage.add(`${slot}:${resourceId}`);
          lecturesScheduled++;
        }
      }
    }
  }

  // Sort by day and time
  timetable.sort((a, b) => {
    const dayOrder = days.indexOf(a.day) - days.indexOf(b.day);
    if (dayOrder !== 0) return dayOrder;
    return a.startTime.localeCompare(b.startTime);
  });

  return timetable;
}

export { parseConstraints, Constraint };
