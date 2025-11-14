import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ConstraintsInputProps {
  constraints: string;
  onChange: (constraints: string) => void;
}

const EXAMPLE_CONSTRAINTS = [
  "Labs must be consecutive",
  "No classes after 3 PM on Fridays",
  "Morning classes preferred for core subjects",
  "Avoid isolated sessions for less important courses",
  "Lunch break between 12 PM and 1 PM",
  "No more than 2 classes per day per course",
];

export function ConstraintsInput({
  constraints,
  onChange,
}: ConstraintsInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Constraints & Rules</h3>
      </div>

      <div className="space-y-4">
        {/* Main input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Enter your scheduling constraints in natural language
          </label>
          <textarea
            value={constraints}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., Labs must be scheduled consecutively. No classes after 3 PM on Fridays. Professor X unavailable Thursday..."
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            rows={5}
          />
          <p className="text-xs text-slate-400 mt-2">
            Write your constraints naturally. The system will parse and apply them during generation.
          </p>
        </div>

        {/* Suggested constraints */}
        <div>
          <p className="text-sm font-medium text-slate-300 mb-3">Common constraints:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_CONSTRAINTS.map((constraint) => (
              <button
                key={constraint}
                onClick={() => {
                  const updated =
                    constraints && !constraints.endsWith("\n")
                      ? constraints + "\n" + constraint
                      : constraints + constraint;
                  onChange(updated.trim());
                }}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors border border-slate-600"
              >
                + {constraint}
              </button>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-slate-300">
          <p className="font-semibold text-blue-400 mb-2">Supported constraint types:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Time-based (no classes after X time, morning only)</li>
            <li>Lab-related (consecutive, isolated avoidance)</li>
            <li>Instructor availability (unavailable on specific days)</li>
            <li>Resource constraints (avoid specific room combinations)</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
