import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TimetableSettingsProps {
  settings: {
    dayStartTime: string;
    dayEndTime: string;
    lunchStartTime: string;
    lunchEndTime: string;
    defaultLectureDuration: number;
  };
  onChange: (settings: {
    dayStartTime: string;
    dayEndTime: string;
    lunchStartTime: string;
    lunchEndTime: string;
    defaultLectureDuration: number;
  }) => void;
}

const DURATION_OPTIONS = [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

export function TimetableSettings({ settings, onChange }: TimetableSettingsProps) {
  const handleChange = (field: string, value: string | number) => {
    onChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-semibold text-white">Timetable Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Day start time */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Day Start Time
          </label>
          <input
            type="time"
            value={settings.dayStartTime}
            onChange={(e) => handleChange("dayStartTime", e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Day end time */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Day End Time
          </label>
          <input
            type="time"
            value={settings.dayEndTime}
            onChange={(e) => handleChange("dayEndTime", e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Lunch start time */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Lunch Start Time
          </label>
          <input
            type="time"
            value={settings.lunchStartTime}
            onChange={(e) => handleChange("lunchStartTime", e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Lunch end time */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Lunch End Time
          </label>
          <input
            type="time"
            value={settings.lunchEndTime}
            onChange={(e) => handleChange("lunchEndTime", e.target.value)}
            className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Default lecture duration */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Default Lecture Duration: {settings.defaultLectureDuration} minutes
          </label>
          <div className="flex gap-2 flex-wrap">
            {DURATION_OPTIONS.map((duration) => (
              <button
                key={duration}
                onClick={() => handleChange("defaultLectureDuration", duration)}
                className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm ${
                  settings.defaultLectureDuration === duration
                    ? "bg-purple-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {duration}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
