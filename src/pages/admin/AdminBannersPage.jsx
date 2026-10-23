import React, { useState, useEffect, useCallback } from 'react';
import {
  Sliders,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Loader2,
  Upload,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { getImageUrl } from '../../utils/request';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    title: '70 Studio',
    subtitle: '',
    badge: '',
    link_url: '#portfolio',
    order_index: 0,
    is_active: 1,
    imageFile: null,
    imagePreview: '',
  });

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.BANNERS.LIST);
      if (res.data?.success) {
        setBanners(res.data.data || []);
      }
    } catch (err) {
      toast.error('Gagal memuat banner.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  const handleOpenCreate = () => {
    setSelectedBanner(null);
    setFormData({
      title: '70 Studio',
      subtitle: '',
      badge: 'Exclusive Photography',
      link_url: '#portfolio',
      order_index: banners.length + 1,
      is_active: 1,
      imageFile: null,
      imagePreview: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setSelectedBanner(banner);
    setFormData({
      title: banner.title || '70 Studio',
      subtitle: banner.subtitle || '',
      badge: banner.badge || '',
      link_url: banner.link_url || '#portfolio',
      order_index: banner.order_index || 0,
      is_active: banner.is_active ? 1 : 0,
      imageFile: null,
      imagePreview: banner.image_url ? getImageUrl(banner.image_url) : '',
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (banner) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      const newStatus = banner.is_active ? 0 : 1;
      const res = await api.put(API_ENDPOINTS.BANNERS.UPDATE(banner.id), {
        is_active: newStatus,
      });
      if (res.data?.success) {
        toast.success(`Banner berhasil ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}.`);
        loadBanners();
      }
    } catch (err) {
      toast.error('Gagal mengubah status banner.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBanner && !formData.imageFile) {
      toast.error('File gambar banner wajib dipilih.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('badge', formData.badge);
      data.append('link_url', formData.link_url);
      data.append('order_index', formData.order_index);
      data.append('is_active', formData.is_active);

      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      }

      if (selectedBanner) {
        const res = await api.put(API_ENDPOINTS.BANNERS.UPDATE(selectedBanner.id), data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.success) {
          toast.success('Banner berhasil diperbarui.');
          setIsFormOpen(false);
          loadBanners();
        }
      } else {
        const res = await api.post(API_ENDPOINTS.BANNERS.CREATE, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.success) {
          toast.success('Banner baru berhasil ditambahkan.');
          setIsFormOpen(false);
          loadBanners();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan banner.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBanner) return;
    try {
      setSubmitting(true);
      const res = await api.delete(API_ENDPOINTS.BANNERS.DELETE(selectedBanner.id));
      if (res.data?.success) {
        toast.success('Banner berhasil dihapus.');
        setIsDeleteOpen(false);
        loadBanners();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus banner.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <Sliders size={22} />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Kelola Banner Slider</h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Atur gambar slide banner utama yang dapat di-swipe pada halaman beranda dan portofolio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Tambah Banner</span>
        </button>
      </div>

      {/* Banners Grid / Table */}
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Memuat banner slider...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="py-16 text-center text-neutral-400">
            <Sliders size={44} className="mx-auto mb-3 opacity-30 text-primary" />
            <p className="text-base font-semibold text-neutral-300">Belum ada banner slider</p>
            <p className="text-xs text-neutral-500 mt-1">Tambahkan banner untuk menghiasi halaman depan studio.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#2e2e2e] bg-[#222222] text-neutral-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Urutan</th>
                  <th className="py-3.5 px-4 font-semibold">Preview Slide</th>
                  <th className="py-3.5 px-4 font-semibold">Judul & Subtitle</th>
                  <th className="py-3.5 px-4 font-semibold">Badge</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828] text-neutral-300">
                {banners.map((b) => (
                  <tr key={b.id} className="hover:bg-[#242424] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">{b.order_index}</td>
                    <td className="py-3.5 px-4">
                      <div className="w-24 h-14 rounded-lg bg-[#282828] border border-[#3a3a3a] overflow-hidden flex items-center justify-center">
                        {b.image_url ? (
                          <img
                            src={getImageUrl(b.image_url)}
                            alt={b.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={18} className="text-neutral-500" />
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{b.title}</p>
                      <p className="text-[11px] text-neutral-400 max-w-sm truncate">{b.subtitle || '-'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.badge ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/20 text-primary border border-primary/30">
                          {b.badge}
                        </span>
                      ) : (
                        <span className="text-neutral-600">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(b)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                          b.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700 hover:bg-neutral-700'
                        }`}
                      >
                        {b.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        <span>{b.is_active ? 'Aktif' : 'Nonaktif'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(b)}
                          className="p-2 rounded-lg text-neutral-300 hover:bg-[#2f2f2f] hover:text-white transition-colors"
                          title="Edit Banner"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(b)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          title="Hapus Banner"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create / Edit */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedBanner ? 'Edit Banner Slider' : 'Tambah Banner Slider'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Judul Banner *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="70 Studio"
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Badge / Tag (Opsional)
              </label>
              <input
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Exclusive Photography"
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Subtitle / Tagline
            </label>
            <textarea
              rows={2}
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Timeless memories, lovingly captured..."
              className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Urutan Slide
              </label>
              <input
                type="number"
                value={formData.order_index}
                onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Status Tayang
              </label>
              <select
                value={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: Number(e.target.value) })}
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value={1}>Aktif (Tampil di Slide)</option>
                <option value={0}>Nonaktif (Sembunyikan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              File Foto Banner {selectedBanner ? '(Opsional jika tidak diganti)' : '*'}
            </label>
            <label className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[#262626] border border-dashed border-[#444] hover:border-primary cursor-pointer transition-colors text-xs text-neutral-300">
              <Upload size={18} className="text-primary" />
              <span>{formData.imageFile ? formData.imageFile.name : 'Pilih file foto banner'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview */}
          {formData.imagePreview && (
            <div>
              <span className="block text-[11px] text-neutral-400 mb-1">Preview Banner:</span>
              <div className="w-full h-36 rounded-xl overflow-hidden bg-[#262626] border border-[#3a3a3a]">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2e2e2e]">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{selectedBanner ? 'Simpan Perubahan' : 'Tambah Banner'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Banner Slider"
        message={`Apakah Anda yakin ingin menghapus banner "${selectedBanner?.title}"?`}
        loading={submitting}
      />
    </div>
  );
}
