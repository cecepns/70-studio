import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Silakan masukkan username dan password');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
      if (res.data?.success) {
        localStorage.setItem('studio70_token', res.data.data.token);
        localStorage.setItem('studio70_user', JSON.stringify(res.data.data.user));
        toast.success('Login berhasil! Mengalihkan ke dashboard...');
        setTimeout(() => {
          navigate('/admin');
        }, 600);
      } else {
        toast.error(res.data?.message || 'Login gagal.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal terhubung ke server. Periksa koneksi backend.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <Toaster position="top-right" />

      {/* Decorative background lights */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#1c1c1c] border border-[#2e2e2e] rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-primary-light items-center justify-center text-white shadow-lg shadow-primary/30 mb-4">
            <Camera size={28} />
          </div>
          <h1 className="font-bangla text-2xl font-bold tracking-wide text-white">70 STUDIO</h1>
          <p className="text-sm text-neutral-400 mt-1">Masuk ke Panel Pengelolaan Konten</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username admin"
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password admin"
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-neutral-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-primary hover:bg-primary-dark active:scale-[0.99] text-white font-medium rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <span>Masuk Sekarang</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
