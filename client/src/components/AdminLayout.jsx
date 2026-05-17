import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';
import { Search, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminLayout = ({ children, role = 'admin' }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex bg-transparent min-h-screen text-slate-900">
      <Sidebar role={role} />
      
      <div className="flex-1 ml-64 flex flex-col">
        {/* Navbar */}
        <header className="h-16 border-b border-orange-500/10 bg-white/40 backdrop-blur-xl sticky top-0 z-10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white/60 border border-slate-200 rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 transition-all text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* <NotificationCenter /> */}
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                <User className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
