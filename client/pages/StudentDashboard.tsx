import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Plus, LogOut, Download, Upload } from "lucide-react";
import { CourseCard } from "@/components/student/CourseCard";
import { AddCourseModal } from "@/components/student/AddCourseModal";

interface Course {
  id: string;
  name: string;
  code?: string;
  totalLectures: number;
  attendedLectures: number;
  targetPercentage: number;
}

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "student") {
      navigate("/student-login");
      return;
    }

    // Load courses from localStorage
    const saved = localStorage.getItem("student_courses");
    if (saved) {
      try {
        setCourses(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    }
  }, [navigate]);

  const saveCourses = (newCourses: Course[]) => {
    setCourses(newCourses);
    localStorage.setItem("student_courses", JSON.stringify(newCourses));
  };

  const handleAddCourse = (courseData: {
    name: string;
    code?: string;
    totalLectures: number;
    attendedLectures: number;
    targetPercentage: number;
  }) => {
    if (editingId) {
      // Update existing course
      saveCourses(
        courses.map((c) =>
          c.id === editingId ? { ...c, ...courseData } : c
        )
      );
      setEditingId(null);
    } else {
      // Add new course
      const newCourse: Course = {
        id: `course_${Date.now()}`,
        ...courseData,
      };
      saveCourses([...courses, newCourse]);
    }
  };

  const handleEditCourse = (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setEditingId(id);
      setShowAddModal(true);
    }
  };

  const handleDeleteCourse = (id: string) => {
    saveCourses(courses.filter((c) => c.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleExport = () => {
    const csv = [
      ["Course Name", "Course Code", "Total Lectures", "Attended", "Attendance %", "Target %", "Status"].join(","),
      ...courses.map((c) => {
        const percentage = c.totalLectures > 0 ? Math.round((c.attendedLectures / c.totalLectures) * 100) : 0;
        const status = percentage >= c.targetPercentage ? "Met" : "Not Met";
        return [
          `"${c.name}"`,
          c.code || "",
          c.totalLectures,
          c.attendedLectures,
          percentage,
          c.targetPercentage,
          status,
        ].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ClassCanvas_Attendance_${new Date().getTime()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const overallAttendance =
    courses.length > 0
      ? Math.round(
          (courses.reduce((sum, c) => sum + c.attendedLectures, 0) /
            courses.reduce((sum, c) => sum + c.totalLectures, 0)) *
            100
        )
      : 0;

  const targetsMet = courses.filter(
    (c) =>
      c.totalLectures > 0 &&
      (c.attendedLectures / c.totalLectures) * 100 >= c.targetPercentage
  ).length;

  const editingCourse = editingId ? courses.find((c) => c.id === editingId) : undefined;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-700 sticky top-0 z-50 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                ClassCanvas
              </h1>
              <p className="text-sm text-slate-400">Student Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-300 transition-colors"
              title="Export as CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Stats section */}
          {courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6"
              >
                <p className="text-slate-400 text-sm mb-2">Overall Attendance</p>
                <p className="text-4xl font-bold text-cyan-400">{overallAttendance}%</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-purple-600/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-6"
              >
                <p className="text-slate-400 text-sm mb-2">Targets Met</p>
                <p className="text-4xl font-bold text-purple-400">
                  {targetsMet}/{courses.length}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-6"
              >
                <p className="text-slate-400 text-sm mb-2">Total Courses</p>
                <p className="text-4xl font-bold text-emerald-400">{courses.length}</p>
              </motion.div>
            </div>
          )}

          {/* Header and CTA */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {courses.length === 0 ? "Welcome back!" : "Your Courses"}
              </h2>
              <p className="text-slate-400">
                {courses.length === 0
                  ? "Start by adding your first course to track attendance"
                  : "Manage your courses and track your attendance"}
              </p>
            </div>
            <motion.button
              onClick={() => {
                setEditingId(null);
                setShowAddModal(true);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/30"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </motion.button>
          </div>

          {/* Courses grid */}
          {courses.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  {...course}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <BookOpen className="w-20 h-20 text-slate-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-slate-300 mb-2">
                No courses yet
              </h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Create your first course to start tracking your attendance and monitor your progress toward your targets
              </p>
              <motion.button
                onClick={() => {
                  setEditingId(null);
                  setShowAddModal(true);
                }}
                whileHover={{ scale: 1.05 }}
                className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-lg transition-colors"
              >
                Add Your First Course
              </motion.button>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add/Edit Course Modal */}
      <AddCourseModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingId(null);
        }}
        onSave={handleAddCourse}
        editingCourse={editingCourse}
      />
    </div>
  );
}
