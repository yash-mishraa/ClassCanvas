/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Auth types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface StudentSignUpRequest extends AuthRequest {
  // email and password inherited
}

export interface FacultySignUpRequest extends AuthRequest {
  departmentCode: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: "student" | "faculty";
  };
}

export interface ErrorResponse {
  error: string;
}

// Student types
export interface Course {
  id: string;
  name: string;
  code?: string;
  totalLectures: number;
  attendedLectures: number;
  targetPercentage: number;
}

export interface StudentDashboardData {
  courses: Course[];
}

// Faculty types
export interface TimetableSettings {
  dayStartTime: string;
  dayEndTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  defaultLectureDuration: number;
}

export interface CourseInstance {
  id: string;
  name: string;
  code: string;
  instructorName: string;
  lecturesPerWeek: number;
  isLab: boolean;
  lectureDuration?: number;
}

export interface TimetableResource {
  type: "classroom" | "lab";
  count: number;
  names?: string[];
}

export interface Constraint {
  id: string;
  description: string;
  type: string;
}

export interface TimetableGenerationRequest {
  settings: TimetableSettings;
  courses: CourseInstance[];
  resources: TimetableResource[];
  constraints: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  courseId: string;
  courseName: string;
  instructorName: string;
  resourceType: "classroom" | "lab";
  resourceId: number;
  isLab: boolean;
}

export interface TimetableData {
  id: string;
  name: string;
  settings: TimetableSettings;
  courses: CourseInstance[];
  slots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface DemoResponse {
  message: string;
}
