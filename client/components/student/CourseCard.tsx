import { motion } from "framer-motion";
import { MoreVertical, Edit2, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";

interface CourseCardProps {
  id: string;
  name: string;
  code?: string;
  totalLectures: number;
  attendedLectures: number;
  targetPercentage: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CourseCard({
  id,
  name,
  code,
  totalLectures,
  attendedLectures,
  targetPercentage,
  onEdit,
  onDelete,
}: CourseCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const currentPercentage =
    totalLectures > 0 ? Math.round((attendedLectures / totalLectures) * 100) : 0;
  const isMetTarget = currentPercentage >= targetPercentage;

  // Calculate classes needed/can miss
  const classesNeeded = Math.ceil(
    (targetPercentage * totalLectures) / 100 - attendedLectures
  );
  const classesMissable = attendedLectures - Math.floor((targetPercentage * totalLectures) / 100);

  const getColorClass = () => {
    if (isMetTarget) return "from-green-500/20 to-emerald-500/20 border-green-500/30";
    if (currentPercentage >= targetPercentage - 10)
      return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30";
    return "from-red-500/20 to-rose-500/20 border-red-500/30";
  };

  const getIndicatorColor = () => {
    if (isMetTarget) return "bg-green-500";
    if (currentPercentage >= targetPercentage - 10) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={`bg-gradient-to-br ${getColorClass()} border rounded-xl p-6 relative overflow-hidden`}
    >
      {/* Header with title and menu */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
          {code && <p className="text-sm text-slate-400">{code}</p>}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-slate-400" />
          </button>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-10"
            >
              <button
                onClick={() => {
                  onEdit(id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2 transition-colors rounded-t-lg"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700/50 flex items-center gap-2 transition-colors rounded-b-lg"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Attendance percentage */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300">Attendance</span>
          <span className="text-2xl font-bold">{currentPercentage}%</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentPercentage}%` }}
            transition={{ duration: 0.5 }}
            className={`h-2 rounded-full ${getIndicatorColor()}`}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-slate-400">Target: {targetPercentage}%</span>
          <span className="text-xs text-slate-400">
            {attendedLectures}/{totalLectures}
          </span>
        </div>
      </div>

      {/* Status indicator and action */}
      <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2 flex-1">
          <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
          <span className="text-xs text-slate-400">
            {isMetTarget ? "✓ Target reached" : classesNeeded > 0 ? `${classesNeeded} more needed` : `Can miss ${classesMissable}`}
          </span>
        </div>
        <button className="p-1 hover:bg-slate-700/50 rounded transition-colors">
          <TrendingUp className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </motion.div>
  );
}
