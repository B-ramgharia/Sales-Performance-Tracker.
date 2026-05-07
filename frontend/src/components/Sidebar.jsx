import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, LogOut, TrendingUp, User as UserIcon, Settings, ChevronRight } from 'lucide-react';

const Sidebar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Upload Data', path: '/upload', icon: <UploadCloud size={20} /> },
  ];

  return (
    <aside className="w-64 bg-primary text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      {/* Brand Header */}
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3 font-bold text-xl">
          <div className="p-2 bg-secondary rounded-lg">
            <TrendingUp className="text-primary" size={24} />
          </div>
          <span className="tracking-tight">SalesTracker<span className="text-secondary">PRO</span></span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-8 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-xl transition-all group ${
              location.pathname === item.path 
                ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                : 'text-gray-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
            {location.pathname === item.path && <ChevronRight size={16} />}
          </Link>
        ))}
        
        <div className="pt-8 border-t border-slate-800 mt-8">
          <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Account</p>
          <button className="w-full flex items-center gap-3 p-3 text-gray-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <UserIcon size={20} />
            <span className="font-medium">Profile</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-gray-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-6 bg-slate-900/50 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center font-bold text-white shadow-inner">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <p className="text-sm font-bold truncate">{user.username}</p>
            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold text-sm transition-all border border-red-500/20"
        >
          <LogOut size={16} />
          LOGOUT
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
