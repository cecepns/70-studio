import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  FolderTree,
  Sliders,
  Plus,
  ArrowUpRight,
  Sparkles,
  Server,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { getImageUrl } from '../../utils/request';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPortfolios: 0,
    totalCategories: 0,
    totalBanners: 0,
    serverStatus: 'Memuat...',
  });
  const [recentPortfolios, setRecentPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [statsRes, portRes] = await Promise.all([
          api.get(API_ENDPOINTS.STATS.SUMMARY).catch(() => ({ data: { success: false } })),
          api.get(API_ENDPOINTS.PORTFOLIOS.LIST, { params: { limit: 6 } }),
        ]);

        if (statsRes.data?.success) {
          setStats(statsRes.data.data);
        }

        if (portRes.data?.success) {
          setRecentPortfolios(portRes.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#242424] via-[#1f1f1f] to-[#2a241c] border border-[#333333] rounded-3xl p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            <span>Studio Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Selamat Datang di Admin 70 Studio
          </h1>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Kelola banner slider yang bisa digeser (swipe), foto portofolio berkualitas tinggi, dan kategori layanan studio Anda secara mudah dan cepat.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/admin/portfolios"
              className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-medium rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              <span>Tambah Foto Portofolio</span>
            </Link>
            <Link
              to="/admin/banners"
              className="px-4 py-2.5 bg-[#2a2a2a] hover:bg-[#333333] text-neutral-200 text-xs sm:text-sm font-medium rounded-xl border border-[#3d3d3d] flex items-center gap-2 transition-colors"
            >
              <Sliders size={16} />
              <span>Atur Banner Slider</span>
            </Link>
          </div>
        </div>

        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Portfolios */}
        <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-5 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Foto</span>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <ImageIcon size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{loading ? '...' : stats.totalPortfolios}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a2a] text-xs">
            <span className="text-neutral-400">Semua Kategori</span>
            <Link to="/admin/portfolios" className="text-primary hover:underline flex items-center gap-1 font-medium">
              <span>Kelola</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Categories */}
        <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-5 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Kategori</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <FolderTree size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{loading ? '...' : stats.totalCategories}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a2a] text-xs">
            <span className="text-neutral-400">Prewedding, Wisuda, dll</span>
            <Link to="/admin/categories" className="text-primary hover:underline flex items-center gap-1 font-medium">
              <span>Kelola</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Total Banners */}
        <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-5 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Banner Slider</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <Sliders size={20} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-3">{loading ? '...' : stats.totalBanners}</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2a2a2a] text-xs">
            <span className="text-neutral-400">Swipeable Hero</span>
            <Link to="/admin/banners" className="text-primary hover:underline flex items-center gap-1 font-medium">
              <span>Kelola</span>
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Server Status */}
        <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-5 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Status Server</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Server size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-semibold text-emerald-400">Aktif & Siap</p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#2a2a2a] text-xs text-neutral-400 truncate">
            {stats.serverStatus}
          </div>
        </div>
      </div>

      {/* Recent Photos Section */}
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Layers className="text-primary" size={20} />
            <h2 className="text-lg font-bold text-white">Foto Portofolio Terbaru</h2>
          </div>
          <Link
            to="/admin/portfolios"
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {recentPortfolios.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <ImageIcon className="mx-auto mb-2 opacity-30" size={40} />
            <p className="text-sm">Belum ada portofolio yang dimuat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {recentPortfolios.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-[#242424] border border-[#333333]"
              >
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-[11px]">
                  <p className="text-white font-medium truncate">{item.title}</p>
                  <p className="text-neutral-400 truncate">{item.category_label || item.category_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
