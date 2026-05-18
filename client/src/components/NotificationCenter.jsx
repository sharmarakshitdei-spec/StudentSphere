import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { Bell, X, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import API from '../services/api';

const NotificationCenter = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

   useEffect(() => {
    if (!user) return;

    const socketUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
      : window.location.origin;
    const socket = io(socketUrl);
    socket.emit('join', user._id);

    socket.on('notification', (notification) => {
      if (notification) {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    });

     
    // (We could add an endpoint for this, but for now we'll just handle real-time)

    return () => socket.disconnect();
  }, [user]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleOpen}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#0f172a] flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
            <h3 className="font-bold text-sm">Notifications</h3>
            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-slate-500" /></button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm italic">
                No new notifications
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-4 border-b border-slate-800 hover:bg-slate-800/30 transition-all flex gap-3">
                  <div className="mt-1">{getIcon(n.type)}</div>
                  <div>
                    <p className="text-sm font-bold text-white">{n.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-slate-600 mt-2">
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : 'Just now'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 bg-slate-800/10 text-center">
            <button className="text-[10px] text-blue-500 hover:underline uppercase font-bold tracking-widest">Mark all as read</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
