import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Bell, Check, Info, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
    
    // Close dropdown on outside click
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error('Error marking notification as read', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <Check className="text-green-500 w-4 h-4" />;
      case 'warning': return <AlertTriangle className="text-orange-500 w-4 h-4" />;
      case 'error': return <XCircle className="text-red-500 w-4 h-4" />;
      default: return <Info className="text-blue-500 w-4 h-4" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-96 glass rounded-3xl shadow-2xl border border-white/20 overflow-hidden z-[100]"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/50">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest">Notifications</h3>
              <span className="text-[10px] font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase">
                {unreadCount} New
              </span>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n, i) => (
                  <div 
                    key={n.id}
                    onClick={() => handleMarkAsRead(n.id)}
                    className={`p-5 border-b border-gray-50 last:border-0 hover:bg-white/50 transition-colors cursor-pointer group ${!n.is_read ? 'bg-primary-50/30' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                        n.type === 'success' ? 'bg-green-50' : 
                        n.type === 'warning' ? 'bg-orange-50' : 
                        n.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
                      }`}>
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-start">
                           <p className={`text-xs font-black ${!n.is_read ? 'text-gray-800' : 'text-gray-500'}`}>{n.title}</p>
                           <span className="text-[8px] font-bold text-gray-400 uppercase">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed line-clamp-2">{n.message}</p>
                        {n.link && (
                          <Link 
                            to={n.link} 
                            className="inline-flex items-center gap-1 text-[9px] font-black text-primary-600 uppercase tracking-widest pt-2 group-hover:gap-2 transition-all"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                  All caught up!
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 text-center">
               <button className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-primary-600 transition-colors">Clear All History</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
