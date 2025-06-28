import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center px-4">
      
      <LoginForm />

      <p className="mt-8 text-center text-gray-600">
        Don’t have an account?{' '}
        <Link
          to="/signup"
          className="text-blue-500 hover:underline font-semibold"
        >
          Signup
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
