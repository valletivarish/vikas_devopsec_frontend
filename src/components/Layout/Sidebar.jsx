import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiBarChart2, FiTrendingUp, FiClipboard } from 'react-icons/fi';

// Sidebar navigation component with links to all main sections
// Uses NavLink for active state highlighting
function Sidebar() {
  // Navigation items with icons and paths
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/surveys', label: 'Surveys', icon: FiFileText },
    { path: '/reports', label: 'Reports', icon: FiClipboard },
    { path: '/forecast', label: 'Forecast', icon: FiTrendingUp },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <nav className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="text-lg" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
