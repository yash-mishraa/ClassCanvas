import { motion } from "framer-motion";
import { Home } from "lucide-react";

interface ResourcesInputProps {
  resources: {
    classrooms: number;
    labs: number;
  };
  onChange: (resources: { classrooms: number; labs: number }) => void;
}

export function ResourcesInput({ resources, onChange }: ResourcesInputProps) {
  const handleChange = (type: "classrooms" | "labs", value: string) => {
    const num = Math.max(0, parseInt(value) || 0);
    onChange({
      ...resources,
      [type]: num,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Home className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Resources</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Number of Classrooms
          </label>
          <input
            type="number"
            value={resources.classrooms}
            onChange={(e) => handleChange("classrooms", e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            min="1"
          />
          <p className="text-xs text-slate-400 mt-1">Generic classroom slots</p>
        </div>

        {/* Labs */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Number of Labs
          </label>
          <input
            type="number"
            value={resources.labs}
            onChange={(e) => handleChange("labs", e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
            min="0"
          />
          <p className="text-xs text-slate-400 mt-1">Laboratory slots</p>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-slate-700">
        <div className="text-sm text-slate-400">
          <p>Total classroom slots: <span className="text-cyan-400 font-semibold">{resources.classrooms}</span></p>
          <p>Total lab slots: <span className="text-cyan-400 font-semibold">{resources.labs}</span></p>
        </div>
      </div>
    </motion.div>
  );
}
