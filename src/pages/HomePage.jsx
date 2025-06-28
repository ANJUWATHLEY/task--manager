import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight mb-6">
            Build your work’s <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              foundation with tasks
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Plan, organize, and collaborate on any project with tasks that adapt to any workflow or type of work.
          </p>

          <div className="flex space-x-4">
            <Link
              to="/signup"
              className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:scale-105 transition"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Login
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            ⭐ 25,000+ reviews from trusted users
          </p>
        </div>

        {/* Right: Optional Illustration */}
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
