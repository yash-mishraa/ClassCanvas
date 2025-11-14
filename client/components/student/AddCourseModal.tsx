import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: {
    name: string;
    code?: string;
    totalLectures: number;
    attendedLectures: number;
    targetPercentage: number;
  }) => void;
  editingCourse?: {
    id: string;
    name: string;
    code?: string;
    totalLectures: number;
    attendedLectures: number;
    targetPercentage: number;
  };
}

const PRESET_PERCENTAGES = [50, 60, 70, 75, 80, 85, 90, 95];

export function AddCourseModal({
  isOpen,
  onClose,
  onSave,
  editingCourse,
}: AddCourseModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [totalLectures, setTotalLectures] = useState("");
  const [attendedLectures, setAttendedLectures] = useState("");
  const [targetPercentage, setTargetPercentage] = useState("75");
  const [customTarget, setCustomTarget] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setCode(editingCourse.code || "");
      setTotalLectures(editingCourse.totalLectures.toString());
      setAttendedLectures(editingCourse.attendedLectures.toString());
      setTargetPercentage(editingCourse.targetPercentage.toString());
    } else {
      resetForm();
    }
  }, [editingCourse, isOpen]);

  const resetForm = () => {
    setName("");
    setCode("");
    setTotalLectures("");
    setAttendedLectures("");
    setTargetPercentage("75");
    setCustomTarget("");
    setError("");
  };

  const handleSave = () => {
    setError("");

    if (!name.trim()) {
      setError("Course name is required");
      return;
    }

    const total = parseInt(totalLectures);
    const attended = parseInt(attendedLectures);
    const target = customTarget ? parseInt(customTarget) : parseInt(targetPercentage);

    if (!total || total <= 0) {
      setError("Total lectures must be a positive number");
      return;
    }

    if (attended < 0 || attended > total) {
      setError("Attended lectures must be between 0 and total lectures");
      return;
    }

    if (target < 0 || target > 100) {
      setError("Target percentage must be between 0 and 100");
      return;
    }

    onSave({
      name: name.trim(),
      code: code.trim() || undefined,
      totalLectures: total,
      attendedLectures: attended,
      targetPercentage: target,
    });

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {editingCourse ? "Edit Course" : "Add Course"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Course name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="e.g., Data Structures"
            />
          </div>

          {/* Course code */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Course Code (Optional)
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="e.g., CS201"
            />
          </div>

          {/* Lectures row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Total Lectures *
              </label>
              <input
                type="number"
                value={totalLectures}
                onChange={(e) => setTotalLectures(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="45"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Attended *
              </label>
              <input
                type="number"
                value={attendedLectures}
                onChange={(e) => setAttendedLectures(e.target.value)}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="35"
              />
            </div>
          </div>

          {/* Target percentage */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Target Attendance {customTarget ? customTarget : targetPercentage}%
            </label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {PRESET_PERCENTAGES.map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    setTargetPercentage(pct.toString());
                    setCustomTarget("");
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    targetPercentage === pct.toString() && !customTarget
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
            <input
              type="number"
              value={customTarget}
              onChange={(e) => {
                setCustomTarget(e.target.value);
                if (!e.target.value) setTargetPercentage("75");
              }}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              placeholder="Or enter custom percentage"
              max="100"
              min="0"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-lg transition-colors"
            >
              {editingCourse ? "Update" : "Add"} Course
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
