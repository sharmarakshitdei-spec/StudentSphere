import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  BookOpen, 
  CalendarCheck, 
  Settings, 
  LogOut,
  Trophy,
  ArrowLeftRight,
  Calendar
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';

const Sidebar = ({ role }) => {
  const dispatch = useDispatch();

  const adminLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Students', icon: Users, path: '/admin/students' },
    { name: 'Teachers', icon: UserSquare2, path: '/admin/teachers' },
    { name: 'Departments', icon: BookOpen, path: '/admin/departments' },
    { name: 'Attendance', icon: CalendarCheck, path: '/admin/attendance' },
  ];

  const teacherLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/teacher' },
    { name: 'Attendance', icon: CalendarCheck, path: '/teacher/attendance' },
    { name: 'Results', icon: Trophy, path: '/teacher/results' },
    { name: 'Assignments', icon: BookOpen, path: '/teacher/assignments' },
    { name: 'Comparison', icon: ArrowLeftRight, path: '/teacher/compare' },
    { name: 'Leave Requests', icon: Calendar, path: '/teacher/leaves' },
  ];

  const links = role === 'admin' ? adminLinks : teacherLinks;

  return (
    <div className="w-64 bg-white/60 backdrop-blur-xl border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span className="text-white text-sm">S</span>
          </div>
          Sphere
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/20'
                  : 'text-slate-500 hover:bg-orange-50 hover:text-orange-600'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
