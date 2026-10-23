import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderTree,
  Image as ImageIcon,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Camera,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('studio70_token');
    const storedUser = localStorage.getItem('studio70_user');
    if (!token) {
      navigate('/admin/login');
    } else if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser({ name: 'Admin', username: 'admin' });
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studio70_token');
    localStorage.removeItem('studio70_user');
    navigate('/admin/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Kelola Banner', path: '/admin/banners', icon: Sliders },
    { name: 'Kategori Portofolio', path: '/admin/categories', icon: FolderTree },
    { name: 'Foto Portofolio', path: '/admin/portfolios', icon: ImageIcon },
  ];

  const isLinkActive = (item) => {
    if (item.exact) {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-neutral-100 flex flex-col font-sans">
      <Toaster position="top-right" toastOptions={{ duration: 3500, style: { background: '#222', color: '#fff', border: '1px solid #333' } }} />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#1a1a1a]/95 backdrop-blur border-b border-[#2b2b2b] px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Toggle Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl text-neutral-300 hover:bg-[#282828] hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-md shadow-primary/20">
              <Camera size={20} />
            </div>
            <div>
              <span className="font-bangla text-lg font-bold tracking-wider text-white">70 STUDIO</span>
              <span className="hidden sm:inline-block ml-2 text-xs uppercase px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 font-medium">
                Admin Panel
              </span>
            </div>
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-primary transition-colors py-1.5 px-3 rounded-lg bg-[#222222] border border-[#333333] hover:border-primary/50"
          >
            <span>Lihat Website</span>
            <ExternalLink size={14} />
          </a>

          <div className="hidden md:flex items-center gap-2 text-xs text-neutral-300 pl-2 border-l border-[#333333]">
            <div className="w-7 h-7 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-primary font-bold">
              <ShieldCheck size={16} />
            </div>
            <span>{user?.name || 'Administrator'}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 py-1.5 px-3 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
            title="Keluar"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-[61px] left-0 z-30 h-[calc(100vh-61px)] w-64 bg-[#1a1a1a] border-r border-[#2b2b2b] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-6">
            <div>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Menu Utama
              </p>
              <nav className="space-y-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-primary text-white shadow-lg shadow-primary/25 font-semibold'
                          : 'text-neutral-400 hover:bg-[#252525] hover:text-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={active ? 'text-white' : 'text-neutral-400'} />
                        <span>{item.name}</span>
                      </div>
                      {active && <ChevronRight size={16} />}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 bg-[#222222] border border-[#2e2e2e] rounded-xl text-xs text-neutral-400">
            <p className="font-semibold text-neutral-300">70 Studio CMS v1.0</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Express + MySQL + React</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#141414] p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
