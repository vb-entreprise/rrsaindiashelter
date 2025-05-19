import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Header component with navigation controls and user actions
 */
const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  return (
    <header className="fixed z-10 w-full bg-white shadow-sm lg:ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="px-2 sm:px-4 lg:px-6 xl:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Left section */}
            <div className="flex items-center flex-1 min-w-0">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 focus:outline-none lg:hidden mr-1"
              >
                <Menu size={20} />
              </button>

              {/* Search bar - hidden on mobile */}
              <div className="relative hidden sm:block flex-1 max-w-xs lg:max-w-md xl:max-w-lg">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <Search size={16} className="text-gray-400" />
                </span>
                <input 
                  className="w-full pl-8 pr-2 py-1.5 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  type="text" 
                  placeholder="Search..." 
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-1.5 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                  <Bell size={18} />
                  <span className="absolute top-0 right-0 h-1.5 w-1.5 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center px-2 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline ml-1">Logout</span>
              </button>

              {/* User menu */}
              <div className="relative">
                <div className="relative">
                  <button 
                    className="flex items-center focus:outline-none group"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 overflow-hidden rounded-full bg-green-100">
                      <div className="flex items-center justify-center h-full">
                        <span className="text-green-700 font-semibold text-sm">
                          {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>
                    </div>
                    <span className="mx-1 sm:mx-2 text-sm font-medium text-gray-700 hidden sm:block">
                      {user?.name || 'Guest'}
                    </span>
                  </button>
                  <div className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ${showUserMenu ? 'block' : 'hidden'}`}>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;