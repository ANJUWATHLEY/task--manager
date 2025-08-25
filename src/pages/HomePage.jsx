import { Link } from "react-router-dom";
import taskimg from "../assets/task.png";
import { motion } from "framer-motion";
import { CheckCircle, Users, BarChart3 } from "lucide-react";

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 overflow-hidden">
      {/* Floating Gradient Circles */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 opacity-30 blur-3xl animate-pulse z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 opacity-30 blur-3xl animate-pulse z-0" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center font-[Inter]">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Build your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              work’s foundation
            </span>{" "}
            with tasks
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg">
            Plan, organize, and collaborate on projects with smart task
            management. Everything your team needs to stay productive in one
            place.
          </p>

          {/* ✅ Buttons ek hi group me align */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="group relative px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                Get Started Free →
              </span>
            </Link>

            <Link
              to="/login"
              className="group px-8 py-4 rounded-xl border-2 border-blue-200 text-blue-700 font-semibold hover:border-blue-400 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center justify-center">
                Login
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  →
                </span>
              </span>
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            ⭐ 25,000+ reviews from trusted users
          </p>
        </motion.div>

        {/* Right Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="hidden md:block"
        >
          <img
            src={taskimg}
            alt="Task Mockup"
            className="rounded-xl shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why teams love our Task Manager
          </h2>
          <p className="text-gray-600 mb-12">
            Everything you need to manage work effectively and beautifully.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "Smart Tasks",
                desc: "Organize and prioritize work with ease.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                desc: "Seamlessly work together in real-time.",
              },
              {
                icon: BarChart3,
                title: "Insightful Analytics",
                desc: "Track progress with beautiful reports.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl shadow-lg bg-gradient-to-br from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 transition"
              >
                <Icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to level up your productivity?
        </h2>
        <p className="max-w-xl mx-auto mb-8 text-lg opacity-90">
          Get started today and see how our task manager transforms your work.
        </p>
        <Link
          to="/signup"
          className="inline-block px-10 py-4 rounded-xl bg-white text-blue-700 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          Get Started Free →
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
