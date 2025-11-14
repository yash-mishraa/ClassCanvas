import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, LogOut, Zap } from "lucide-react";
import { TimetableSettings } from "@/components/faculty/TimetableSettings";
import { CourseInput } from "@/components/faculty/CourseInput";
import { ResourcesInput } from "@/components/faculty/ResourcesInput";
import { ConstraintsInput } from "@/components/faculty/ConstraintsInput";

interface Course {
  id: string;
  name: string;
  code: string;
  instructorName: string;
  lecturesPerWeek: number;
  isLab: boolean;
  lectureDuration?: number;
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

export default function FacultyDashboard() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    dayStartTime: "09:15",
    dayEndTime: "17:00",
    lunchStartTime: "12:30",
    lunchEndTime: "13:30",
    defaultLectureDuration: 60,
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState({
    classrooms: 5,
    labs: 2,
  });
  const [constraints, setConstraints] = useState("");
  const [generatedTimetable, setGeneratedTimetable] = useState<TimeSlot[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"setup" | "preview">("setup");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "faculty") {
      navigate("/faculty-login");
      return;
    }

    // Load saved data from localStorage
    const saved = localStorage.getItem("faculty_timetable_data");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSettings(data.settings || settings);
        setCourses(data.courses || []);
        setResources(data.resources || resources);
        setConstraints(data.constraints || "");
      } catch (err) {
        console.error("Failed to load saved data", err);
      }
    }
  }, [navigate]);

  const saveData = () => {
    localStorage.setItem(
      "faculty_timetable_data",
      JSON.stringify({
        settings,
        courses,
        resources,
        constraints,
      })
    );
  };

  const handleGenerateTimetable = async () => {
    if (courses.length === 0) {
      alert("Please add at least one course");
      return;
    }

    setIsGenerating(true);
    try {
      // Save before generating
      saveData();

      const payload = {
        settings,
        courses,
        resources,
        constraints,
      };

      console.log("Sending timetable generation request:", payload);

      // Generate timetable using backend
      const response = await fetch("/api/faculty/generate-timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          `Server error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Timetable generated successfully:", data);

      if (data.timetable && data.timetable.length > 0) {
        setGeneratedTimetable(data.timetable);
        setActiveTab("preview");
      } else {
        alert(
          "Timetable generated but no slots found. Check your course and resource configuration."
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error generating timetable:", errorMessage);
      alert(`Failed to generate timetable: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleExportTimetable = (format: "csv" | "pdf") => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timeSlots = generateTimeSlots(generatedTimetable, settings.dayStartTime, settings.dayEndTime);

    let csvContent = "";
    csvContent += "ClassCanvas Timetable Export\n";
    csvContent += "Generated: " + new Date().toLocaleString() + "\n";
    csvContent += "Day Start: " + settings.dayStartTime + ", Day End: " + settings.dayEndTime + "\n";
    csvContent += "Lunch: " + settings.lunchStartTime + " - " + settings.lunchEndTime + "\n\n";

    // Create CSV table
    csvContent += "Time," + days.join(",") + "\n";

    timeSlots.forEach((time) => {
      csvContent += time;
      days.forEach((day) => {
        const slot = generatedTimetable.find(
          (s) => s.day.toLowerCase() === day.toLowerCase() && s.startTime === time
        );
        if (slot) {
          csvContent += ',"' + slot.courseName + " (" + slot.instructorName + ')"';
        } else {
          csvContent += ",";
        }
      });
      csvContent += "\n";
    });

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "timetable_" + new Date().getTime() + ".csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-700 sticky top-0 z-50 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/10 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                ClassCanvas
              </h1>
              <p className="text-sm text-slate-400">Faculty Portal</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("setup")}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                activeTab === "setup"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-300"
              }`}
            >
              Setup
            </button>
            {generatedTimetable.length > 0 && (
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-6 py-3 font-semibold rounded-lg transition-colors ${
                  activeTab === "preview"
                    ? "bg-purple-600 text-white"
                    : "bg-slate-800/50 text-slate-400 hover:text-slate-300"
                }`}
              >
                Preview
              </button>
            )}
          </div>

          {/* Setup tab */}
          {activeTab === "setup" && (
            <div className="space-y-8 mb-8">
              <TimetableSettings settings={settings} onChange={setSettings} />
              <CourseInput
                courses={courses}
                onChange={setCourses}
                defaultDuration={settings.defaultLectureDuration}
              />
              <ResourcesInput resources={resources} onChange={setResources} />
              <ConstraintsInput constraints={constraints} onChange={setConstraints} />

              {/* Generate button */}
              <motion.button
                onClick={handleGenerateTimetable}
                disabled={isGenerating || courses.length === 0}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {isGenerating ? "Generating..." : "Generate Timetable"}
              </motion.button>
            </div>
          )}

          {/* Preview tab */}
          {activeTab === "preview" && generatedTimetable.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-6"
            >
              <h3 className="text-2xl font-bold text-white mb-6">
                Generated Timetable
              </h3>

              {/* Weekly grid */}
              <div className="overflow-x-auto">
                <div className="min-w-max bg-slate-900/50 rounded-lg border border-slate-700">
                  {/* Days header */}
                  <div className="grid grid-cols-6 border-b border-slate-700">
                    <div className="p-4 font-semibold text-slate-400 text-sm">
                      Time
                    </div>
                    {days.map((day) => (
                      <div
                        key={day}
                        className="p-4 font-semibold text-center text-white border-r border-slate-700 last:border-r-0"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  {generateTimeSlots(generatedTimetable, settings.dayStartTime, settings.dayEndTime).map((time) => (
                    <div key={time} className="grid grid-cols-6 border-b border-slate-700 last:border-b-0">
                      <div className="p-3 text-sm text-slate-400 font-medium border-r border-slate-700">
                        {time}
                      </div>
                      {days.map((day) => {
                        const slot = generatedTimetable.find(
                          (s) =>
                            s.day.toLowerCase() === day.toLowerCase() &&
                            s.startTime === time
                        );
                        return (
                          <div
                            key={`${day}-${time}`}
                            className="p-2 border-r border-slate-700 last:border-r-0"
                          >
                            {slot && (
                              <div
                                className={`p-2 rounded text-xs ${
                                  slot.courseId === "lunch_break"
                                    ? "bg-amber-500/20 border border-amber-500/40"
                                    : slot.isLab
                                    ? "bg-blue-500/20 border border-blue-500/40"
                                    : "bg-purple-500/20 border border-purple-500/40"
                                }`}
                              >
                                <p className="font-semibold text-white">
                                  {slot.courseName}
                                </p>
                                {slot.courseId !== "lunch_break" && (
                                  <>
                                    <p className="text-slate-300">
                                      {slot.instructorName}
                                    </p>
                                    <p className="text-slate-400 text-xs">
                                      {slot.resourceType} {slot.resourceId}
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend and Export */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-500/20 border border-purple-500/40 rounded" />
                    <span className="text-slate-300">Lecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500/20 border border-blue-500/40 rounded" />
                    <span className="text-slate-300">Lab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500/20 border border-amber-500/40 rounded" />
                    <span className="text-slate-300">Lunch Break</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleExportTimetable("csv")}
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold rounded-lg transition-colors"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExportTimetable("pdf")}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Export PDF
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "preview" && generatedTimetable.length === 0 && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <p className="text-slate-400">No timetable generated yet</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function generateTimeSlots(timetable: TimeSlot[], dayStartTime: string, dayEndTime: string): string[] {
  // Extract unique start times from generated timetable (only actual lecture slots)
  const lectureSlots = timetable.filter((slot) => slot.courseId !== "lunch_break");
  const uniqueTimes = new Set(lectureSlots.map((slot) => slot.startTime));

  // If no timetable yet, generate from settings using 30-min increments
  if (uniqueTimes.size === 0) {
    const [startHour, startMin] = dayStartTime.split(":").map(Number);
    const [endHour] = dayEndTime.split(":").map(Number);
    const slots: string[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        slots.push(`${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`);
      }
    }
    return slots;
  }

  // Get all unique times (including lunch breaks) and sort
  const allTimes = new Set(timetable.map((slot) => slot.startTime));
  return Array.from(allTimes).sort();
}
