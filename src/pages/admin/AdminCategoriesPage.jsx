import React, { useState, useEffect, useCallback } from 'react';
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { useDebounce } from '../../hooks/useDebounce';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Form fields (Only Name, Label, Description, and Order - No Image)
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: '',
    order_index: 0,
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.CATEGORIES.LIST, {
        params: { search: debouncedSearch },
      });
      if (res.data?.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      toast.error('Gagal memuat kategori.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      label: '',
      description: '',
      order_index: categories.length + 1,
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name || '',
      label: cat.label || '',
      description: cat.description || '',
      order_index: cat.order_index || 0,
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (cat) => {
    setSelectedCategory(cat);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.label.trim()) {
      toast.error('Nama dan label kategori wajib diisi.');
      return;
    }

    try {
      setFormSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        label: formData.label.trim(),
        description: formData.description.trim(),
        order_index: formData.order_index,
      };

      if (selectedCategory) {
        // Edit Mode
        const res = await api.put(API_ENDPOINTS.CATEGORIES.UPDATE(selectedCategory.id), payload);
        if (res.data?.success) {
          toast.success('Kategori berhasil diperbarui.');
          setIsFormOpen(false);
          loadCategories();
        }
      } else {
        // Create Mode
        const res = await api.post(API_ENDPOINTS.CATEGORIES.CREATE, payload);
        if (res.data?.success) {
          toast.success('Kategori berhasil ditambahkan.');
          setIsFormOpen(false);
          loadCategories();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan data kategori.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;
    try {
      setDeleteSubmitting(true);
      const res = await api.delete(API_ENDPOINTS.CATEGORIES.DELETE(selectedCategory.id));
      if (res.data?.success) {
        toast.success('Kategori berhasil dihapus.');
        setIsDeleteOpen(false);
        loadCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus kategori.');
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <FolderTree size={22} />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Kelola Kategori Portofolio</h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Tambah dan atur nama kategori portofolio untuk filter galeri foto studio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-4">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori berdasarkan nama / label..."
            className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Memuat daftar kategori...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-neutral-400">
            <FolderTree size={44} className="mx-auto mb-3 opacity-30 text-primary" />
            <p className="text-base font-semibold text-neutral-300">Tidak ada kategori ditemukan</p>
            <p className="text-xs text-neutral-500 mt-1">Coba kata kunci pencarian lain atau tambahkan kategori baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#2e2e2e] bg-[#222222] text-neutral-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold w-20">Urutan</th>
                  <th className="py-3.5 px-4 font-semibold">Nama Teknis / Slug</th>
                  <th className="py-3.5 px-4 font-semibold">Label Publik (Tampilan Filter)</th>
                  <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Deskripsi</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Jumlah Foto</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828] text-neutral-300">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-[#242424] transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded text-xs">
                        <Hash size={12} className="text-primary" />
                        {cat.order_index}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-white">{cat.name}</p>
                      <p className="text-[11px] text-neutral-500 font-mono">/{cat.slug || cat.name.toLowerCase()}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/25">
                        {cat.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell max-w-xs truncate text-neutral-400">
                      {cat.description || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-800 border border-neutral-700 text-neutral-300">
                        {cat.portfolio_count ?? 0} foto
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cat)}
                          className="p-2 rounded-lg text-neutral-300 hover:bg-[#2f2f2f] hover:text-white transition-colors"
                          title="Edit Kategori"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(cat)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          title="Hapus Kategori"
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

      {/* Modal Create/Edit (Clean form without images) */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedCategory ? 'Edit Kategori Portofolio' : 'Tambah Kategori Baru'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Nama Teknis (ID / Slug) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Misal: Prewedding, Graduation"
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Label Publik (Teks Tombol Filter) *
              </label>
              <input
                type="text"
                required
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Misal: Wisuda, Foto Keluarga"
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Deskripsi Singkat (Opsional)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Deskripsi singkat estetika foto kategori ini..."
              className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Urutan Tampil
            </label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: Number(e.target.value) })}
              className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-primary"
            />
          </div>

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
              disabled={formSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50"
            >
              {formSubmitting && <Loader2 size={16} className="animate-spin" />}
              <span>{selectedCategory ? 'Simpan Perubahan' : 'Buat Kategori'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Modal Confirm Delete */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Kategori Portofolio"
        message={`Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.label || selectedCategory?.name}"? Seluruh foto dalam kategori ini juga akan terhapus.`}
        loading={deleteSubmitting}
      />
    </div>
  );
}
