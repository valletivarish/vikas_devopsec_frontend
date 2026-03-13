import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';

// Top navigation bar displaying user info and logout button
function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout and redirect to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-primary-700">Survey Platform</h1>

      <div className="flex items-center gap-4">
        {/* Display current user info */}
        <div className="flex items-center gap-2 text-gray-600">
          <FiUser />
          <span className="text-sm font-medium">{user?.fullName || user?.username}</span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors text-sm"
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
