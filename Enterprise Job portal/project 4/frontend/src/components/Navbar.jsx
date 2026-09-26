import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, LogOut, Menu, X, MessageSquare, Calendar,
  Search, LayoutDashboard, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLink = (to, label, icon) => (
    <Link
      to={to}
      onClick={() => setIsOpen(false)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
        isActive(to)
          ? 'bg-primary-600 text-white shadow-md shadow-primary-200'
          : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  );

  const dashboardPath =
    user?.role === 'admin' ? '/admin'
    : user?.role === 'seeker' ? '/seeker'
    : '/recruiter';

  const roleBadgeColor =
    user?.role === 'admin' ? 'bg-red-100 text-red-600'
    : user?.role === 'recruiter' ? 'bg-purple-100 text-purple-600'
    : 'bg-blue-100 text-blue-600';

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="bg-primary-600 p-2 rounded-xl group-hover:bg-primary-700 transition-colors">
            <Briefcase className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black text-gray-900">
            Job<span className="text-primary-600">Portal</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLink('/jobs', 'Find Jobs', <Search className="w-3.5 h-3.5" />)}

          {user && navLink(dashboardPath, 'Dashboard', <LayoutDashboard className="w-3.5 h-3.5" />)}
          {user && navLink('/chat', 'Messages', <MessageSquare className="w-3.5 h-3.5" />)}
          {/* Interviews only visible to seekers */}
          {user?.role === 'seeker' && navLink('/interviews', 'Interviews', <Calendar className="w-3.5 h-3.5" />)}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationCenter />

              <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-black text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 leading-none">{user.name}</span>
                  <span className={`text-[10px] font-black uppercase rounded-full px-1.5 py-0.5 mt-0.5 w-fit ${roleBadgeColor}`}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors px-4 py-2 rounded-full hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-200"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 space-y-2">
              <Link to="/jobs" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">
                <Search className="w-4 h-4 text-primary-500" /> Find Jobs
              </Link>

              {user && (
                <>
                  <Link to={dashboardPath} onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">
                    <LayoutDashboard className="w-4 h-4 text-primary-500" /> Dashboard
                  </Link>
                  <Link to="/chat" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">
                    <MessageSquare className="w-4 h-4 text-primary-500" /> Messages
                  </Link>
                  {user.role === 'seeker' && (
                    <Link to="/interviews" onClick={() => setIsOpen(false)} className="flex items-center gap-2 py-2.5 px-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">
                      <Calendar className="w-4 h-4 text-primary-500" /> Interviews
                    </Link>
                  )}
                </>
              )}

              <div className="border-t border-gray-100 pt-3 mt-2">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-black">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{user.name}</p>
                        <span className={`text-[10px] font-black uppercase rounded-full px-2 py-0.5 ${roleBadgeColor}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl text-red-500 font-semibold hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2.5 px-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="block py-2.5 px-3 rounded-xl bg-primary-600 text-white font-bold text-center">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;