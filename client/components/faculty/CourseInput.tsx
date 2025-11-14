import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { BookOpen } from "lucide-react";

interface CourseInputProps {
  courses: Array<{
    id: string;
    name: string;
    code: string;
    instructorName: string;
    lecturesPerWeek: number;
    isLab: boolean;
    lectureDuration?: number;
  }>;
  onChange: (courses: Array<{
    id: string;
    name: string;
    code: string;
    instructorName: string;
    lecturesPerWeek: number;
    isLab: boolean;
    lectureDuration?: number;
  }>) => void;
  defaultDuration: number;
}

export function CourseInput({ courses, onChange, defaultDuration }: CourseInputProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    instructorName: "",
    lecturesPerWeek: "",
    isLab: false,
    lectureDuration: defaultDuration,
  });

  const handleAddCourse = () => {
    if (!formData.name || !formData.code || !formData.instructorName || !formData.lecturesPerWeek) {
      alert("Please fill all fields");
      return;
    }

    const newCourse = {
      id: `course_${Date.now()}`,
      name: formData.name,
      code: formData.code,
      instructorName: formData.instructorName,
      lecturesPerWeek: parseInt(formData.lecturesPerWeek),
      isLab: formData.isLab,
      lectureDuration: defaultDuration,
    };

    onChange([...courses, newCourse]);
    setFormData({
      name: "",
      code: "",
      instructorName: "",
      lecturesPerWeek: "",
      isLab: false,
      lectureDuration: defaultDuration,
    });
    setShowForm(false);
  };

  const handleRemoveCourse = (id: string) => {
    onChange(courses.filter((c) => c.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Courses</h3>
        <span className="ml-auto px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full">
          {courses.length} courses
        </span>
      </div>

      {/* Courses list */}
      {courses.length > 0 && (
        <div className="mb-6 space-y-3">
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between bg-slate-700/30 border border-slate-600 rounded-lg p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-white">{course.name}</h4>
                  <span className="text-sm text-slate-400">({course.code})</span>
                  {course.isLab && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                      Lab
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-400">
                  {course.instructorName} • {course.lecturesPerWeek} lectures/week
                </div>
              </div>
              <button
                onClick={() => handleRemoveCourse(course.id)}
                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add course form */}
      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Course name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Course code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <input
              type="text"
              placeholder="Instructor name"
              value={formData.instructorName}
              onChange={(e) =>
                setFormData({ ...formData, instructorName: e.target.value })
              }
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <input
              type="number"
              placeholder="Lectures per week"
              value={formData.lecturesPerWeek}
              onChange={(e) =>
                setFormData({ ...formData, lecturesPerWeek: e.target.value })
              }
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              min="1"
            />
            <label className="flex items-center gap-2 px-3 py-2">
              <input
                type="checkbox"
                checked={formData.isLab}
                onChange={(e) => setFormData({ ...formData, isLab: e.target.checked })}
                className="rounded"
              />
              <span className="text-slate-300">Is Lab</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAddCourse}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Add Course
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full px-4 py-3 border-2 border-dashed border-slate-600 hover:border-purple-500 text-slate-400 hover:text-purple-400 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Course
        </button>
      )}
    </motion.div>
  );
}
