import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="  animate-float  relative min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      {/* Glowing Floating Circle */}
      <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-3xl animate-float z-0" />

      {/* Main Content Section */}
      <div className="relative z-10 max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center font-[Inter]">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
            Build your work's <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              foundation with tasks
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Plan, organize, and collaborate on any project with tasks that adapt to any workflow or type of work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Sign Up Button */}
            <Link
              to="/signup"
              className="group relative px-8 py-4 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center">
                <span className="mr-2"></span>
                Get Started Free
                <span className="ml-2">→</span>
              </span>
            </Link>

            {/* Login Button */}
            <Link
              to="/login"
              className="group px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-purple-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center justify-center">
                <span className="mr-2"></span>
                Login
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
              </span>
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            25,000+ reviews from trusted users
          </p>
        </div>

        {/* Right Image */}
        <div className="hidden md:block">
          <img
            src="https://clickup.com/images/homepage/task-management.webp"
            alt="Task Mockup"
            className="rounded-xl shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
