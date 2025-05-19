import React from 'react';
import { NavLink } from 'react-router-dom';
import { PawPrint, LayoutDashboard, FileText, Utensils, Trash2, Package, Users, Shield, Settings, X, Image, Layers, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Sidebar navigation component
 * Shows different menu items based on user permissions
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { user, hasPermission } = useAuth();

  // State for expanding/collapsing parent menus
  const [userMgmtOpen, setUserMgmtOpen] = React.useState(false);
  const [feedingOpen, setFeedingOpen] = React.useState(false);

  return (
    <>
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-20 transition-opacity bg-black bg-opacity-50 lg:hidden ${
          isOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 ease-in duration-200 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        {/* Logo and close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center">
            <PawPrint className="w-8 h-8 text-green-600" />
            <span className="mx-2 text-xl font-semibold text-gray-800">RRSA India</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="mt-5 px-3">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
              }`
            }
          >
            <LayoutDashboard size={20} className="mr-3" />
            <span className="font-medium">Dashboard</span>
          </NavLink>

          {/* User Management (parent) */}
          <button
            onClick={() => setUserMgmtOpen((v) => !v)}
            className="flex items-center w-full px-4 py-3 mt-2 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors duration-300 focus:outline-none"
          >
            <Users size={20} className="mr-3" />
            <span className="font-medium flex-1 text-left">User Management</span>
            {userMgmtOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {userMgmtOpen && (
            <div className="ml-8">
              <NavLink
                to="/users"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-1 text-gray-600 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
                  }`
                }
              >
                <Users size={16} className="mr-2" />
                Users
              </NavLink>
              <NavLink
                to="/roles"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-1 text-gray-600 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
                  }`
                }
              >
                <Shield size={16} className="mr-2" />
                Roles
              </NavLink>
            </div>
          )}

          {/* Case Paper */}
          <NavLink
            to="/case-papers"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
              }`
            }
          >
            <FileText size={20} className="mr-3" />
            <span className="font-medium">Case Paper</span>
          </NavLink>

          {/* Feeding (parent) */}
          <button
            onClick={() => setFeedingOpen((v) => !v)}
            className="flex items-center w-full px-4 py-3 mt-2 text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors duration-300 focus:outline-none"
          >
            <Utensils size={20} className="mr-3" />
            <span className="font-medium flex-1 text-left">Feeding</span>
            {feedingOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {feedingOpen && (
            <div className="ml-8">
              <NavLink
                to="/feeding/records"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-1 text-gray-600 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
                  }`
                }
              >
                <Layers size={16} className="mr-2" />
                Feeding Records
              </NavLink>
              <NavLink
                to="/feeding/menu"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-1 text-gray-600 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
                  }`
                }
              >
                <Layers size={16} className="mr-2" />
                Menu
              </NavLink>
              <NavLink
                to="/feeding/add"
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 mt-1 text-gray-600 rounded-lg ${
                    isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
                  }`
                }
              >
                <Plus size={16} className="mr-2" />
                Add Feeding Record
              </NavLink>
            </div>
          )}

          {/* Cleaning */}
          <NavLink
            to="/cleaning"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
              }`
            }
          >
            <Trash2 size={20} className="mr-3" />
            <span className="font-medium">Cleaning</span>
          </NavLink>

          {/* Media */}
          <NavLink
            to="/media"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
              }`
            }
          >
            <Image size={20} className="mr-3" />
            <span className="font-medium">Media</span>
          </NavLink>

          {/* Inventory */}
          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mt-2 text-gray-600 transition-colors duration-300 transform rounded-lg ${
                isActive ? 'bg-green-100 text-green-700' : 'hover:bg-green-50 hover:text-green-600'
              }`
            }
          >
            <Package size={20} className="mr-3" />
            <span className="font-medium">Inventory</span>
          </NavLink>
        </nav>

        {/* User info at bottom */}
        {user && (
          <div className="absolute bottom-0 w-full p-4 border-t">
            <div className="flex items-center">
              <div className="w-10 h-10 overflow-hidden rounded-full bg-green-200 flex items-center justify-center">
                <span className="text-green-700 font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{user.name || 'Guest'}</p>
                <p className="text-xs text-gray-500">{user.email || 'Not logged in'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;