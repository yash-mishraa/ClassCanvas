import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Users } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <motion.div
        className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header section */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <motion.h1
            className="text-5xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            ClassCanvas
          </motion.h1>
          <motion.p
            className="text-xl text-slate-300 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Intelligent attendance tracking and timetable management for educational institutions
          </motion.p>
        </motion.div>

        {/* Card selection */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 w-full max-w-4xl"
          variants={itemVariants}
        >
          {/* Student Card */}
          <motion.button
            onClick={() => navigate("/student-login")}
            onMouseEnter={() => setHoveredCard("student")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl transition-all duration-300"
              animate={
                hoveredCard === "student"
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
            />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl p-8 sm:p-10 transition-all duration-300">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  className="p-4 bg-cyan-500/10 rounded-full"
                  animate={hoveredCard === "student" ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookOpen className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-cyan-400">
                    Student
                  </h2>
                  <p className="text-slate-300 text-center">
                    Track your attendance, monitor progress toward your targets, and understand exactly how many more classes you need
                  </p>
                </div>
                <motion.div
                  className="mt-4 px-6 py-3 bg-cyan-500 text-slate-950 font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/50"
                  animate={hoveredCard === "student" ? { y: -2 } : { y: 0 }}
                >
                  Continue as Student
                </motion.div>
              </div>
            </div>
          </motion.button>

          {/* Faculty Card */}
          <motion.button
            onClick={() => navigate("/faculty-login")}
            onMouseEnter={() => setHoveredCard("faculty")}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-2xl blur-xl transition-all duration-300"
              animate={
                hoveredCard === "faculty"
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
            />
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-8 sm:p-10 transition-all duration-300">
              <div className="flex flex-col items-center gap-6">
                <motion.div
                  className="p-4 bg-purple-600/10 rounded-full"
                  animate={hoveredCard === "faculty" ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="w-12 h-12 text-purple-400" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-purple-400">
                    Faculty
                  </h2>
                  <p className="text-slate-300 text-center">
                    Generate optimized timetables with constraints, manage resources, and export professional schedules
                  </p>
                </div>
                <motion.div
                  className="mt-4 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-600/50"
                  animate={hoveredCard === "faculty" ? { y: -2 } : { y: 0 }}
                >
                  Continue as Faculty
                </motion.div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-slate-400 text-sm"
          variants={itemVariants}
        >
          <p>© 2024 ClassCanvas. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
