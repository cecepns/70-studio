import React, { useState, useEffect, useCallback } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  Loader2,
  Upload,
  Layers,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import { API_ENDPOINTS } from '../../utils/endpoints';
import { getImageUrl } from '../../utils/request';
import { useDebounce } from '../../hooks/useDebounce';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import Pagination from '../../components/admin/Pagination';

export default function AdminPortfoliosPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const debouncedSearch = useDebounce(search, 350);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Single Form fields
  const [formData, setFormData] = useState({
    title: '',
    category_id: 1,
    order_index: 0,
    imageFile: null,
    imagePreview: '',
  });

  // Batch Form fields
  const [batchCategory, setBatchCategory] = useState(1);
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchPreviews, setBatchPreviews] = useState([]);

  // Load Categories for dropdown
  useEffect(() => {
    async function loadCats() {
      try {
        const res = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
        if (res.data?.success) {
          setCategories(res.data.data || []);
          if (res.data.data?.length > 0 && !formData.category_id) {
            setFormData((p) => ({ ...p, category_id: res.data.data[0].id }));
            setBatchCategory(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCats();
  }, []);

  // Fetch Portfolios from API
  const loadPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(API_ENDPOINTS.PORTFOLIOS.LIST, {
        params: {
          page,
          limit,
          search: debouncedSearch,
          category: selectedCategory,
        },
      });

      if (res.data?.success) {
        setPortfolios(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.totalPages || 1);
          setTotalItems(res.data.pagination.total || 0);
        }
      }
    } catch (err) {
      toast.error('Gagal memuat foto portofolio.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, selectedCategory]);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // Reset page to 1 on search or filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormData({
      title: '',
      category_id: categories[0]?.id || 1,
      order_index: 0,
      imageFile: null,
      imagePreview: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      category_id: item.category_id || categories[0]?.id || 1,
      order_index: item.order_index || 0,
      imageFile: null,
      imagePreview: item.image_url ? getImageUrl(item.image_url) : '',
    });
    setIsFormOpen(true);
  };

  const handleOpenDelete = (item) => {
    setSelectedItem(item);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem && !formData.imageFile) {
      toast.error('Silakan pilih file foto portofolio.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category_id', formData.category_id);
      data.append('order_index', formData.order_index);

      if (formData.imageFile) {
        data.append('image', formData.imageFile);
      }

      if (selectedItem) {
        const res = await api.put(API_ENDPOINTS.PORTFOLIOS.UPDATE(selectedItem.id), data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.success) {
          toast.success('Foto portofolio berhasil diperbarui.');
          setIsFormOpen(false);
          loadPortfolios();
        }
      } else {
        const res = await api.post(API_ENDPOINTS.PORTFOLIOS.CREATE, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data?.success) {
          toast.success('Foto portofolio berhasil ditambahkan.');
          setIsFormOpen(false);
          loadPortfolios();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan foto portofolio.');
    } finally {
      setSubmitting(false);
    }
  };

  // Batch Upload Handlers
  const handleBatchFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setBatchFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setBatchPreviews(previews);
  };

  const handleBatchSubmit = async (e) => {
    e.preventDefault();
    if (batchFiles.length === 0) {
      toast.error('Pilih setidaknya satu file foto.');
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('category_id', batchCategory);
      batchFiles.forEach((file) => {
        data.append('images', file);
      });

      const res = await api.post(API_ENDPOINTS.PORTFOLIOS.BATCH_CREATE, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Batch foto berhasil diunggah.');
        setIsBatchOpen(false);
        setBatchFiles([]);
        setBatchPreviews([]);
        loadPortfolios();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengunggah foto batch.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      setSubmitting(true);
      const res = await api.delete(API_ENDPOINTS.PORTFOLIOS.DELETE(selectedItem.id));
      if (res.data?.success) {
        toast.success('Foto berhasil dihapus.');
        setIsDeleteOpen(false);
        loadPortfolios();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus foto.');
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
            <ImageIcon size={22} />
            <h1 className="text-xl sm:text-2xl font-bold text-white">Kelola Foto Portofolio</h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Unggah foto baru, edit judul/kategori, atau hapus foto dari galeri studio.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsBatchOpen(true)}
            className="px-3.5 py-2.5 bg-[#262626] hover:bg-[#303030] text-neutral-200 text-xs sm:text-sm font-semibold rounded-xl border border-[#3e3e3e] flex items-center gap-2 transition-all active:scale-95"
          >
            <Layers size={16} className="text-primary" />
            <span>Upload Batch Foto</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Tambah Foto</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Real-time Debounced Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari foto portofolio..."
            className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary placeholder:text-neutral-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={16} className="text-neutral-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 bg-[#262626] border border-[#3a3a3a] text-neutral-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug || c.id}>
                {c.label || c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Portfolios Gallery Table / Cards */}
      <div className="bg-[#1c1c1c] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 size={36} className="animate-spin text-primary mb-3" />
            <p className="text-sm">Memuat galeri portofolio...</p>
          </div>
        ) : portfolios.length === 0 ? (
          <div className="py-20 text-center text-neutral-400">
            <ImageIcon size={44} className="mx-auto mb-3 opacity-30 text-primary" />
            <p className="text-base font-semibold text-neutral-300">Tidak ada foto ditemukan</p>
            <p className="text-xs text-neutral-500 mt-1">Coba ganti filter atau unggah foto portofolio baru.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#2e2e2e] bg-[#222222] text-neutral-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-semibold">Foto</th>
                  <th className="py-3.5 px-4 font-semibold">Judul Portofolio</th>
                  <th className="py-3.5 px-4 font-semibold">Kategori</th>
                  <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Dimensi</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828] text-neutral-300">
                {portfolios.map((item) => (
                  <tr key={item.id} className="hover:bg-[#242424] transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-14 h-14 rounded-xl bg-[#282828] border border-[#3a3a3a] overflow-hidden">
                        <img
                          src={getImageUrl(item.image_url)}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-[11px] text-neutral-500 truncate max-w-xs font-mono">
                        {item.image_url}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                        {item.category_label || item.category_name || 'General'}
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell font-mono text-neutral-400 text-xs">
                      {item.width || 1600} × {item.height || 1200}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-lg text-neutral-300 hover:bg-[#2f2f2f] hover:text-white transition-colors"
                          title="Edit Portofolio"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(item)}
                          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                          title="Hapus Portofolio"
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

        {/* Reusable Backend Pagination */}
        <div className="border-t border-[#2e2e2e] bg-[#1f1f1f] px-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            limit={limit}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Modal Single Create / Edit */}
      <AdminModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedItem ? 'Edit Foto Portofolio' : 'Tambah Foto Portofolio'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Judul Foto *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Misal: Graduation Session #1"
              className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Kategori *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label || c.name}
                  </option>
                ))}
              </select>
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
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              File Foto {selectedItem ? '(Opsional jika tidak diganti)' : '*'}
            </label>
            <label className="flex items-center gap-2 px-3.5 py-3 rounded-xl bg-[#262626] border border-dashed border-[#444] hover:border-primary cursor-pointer transition-colors text-xs text-neutral-300">
              <Upload size={18} className="text-primary" />
              <span>{formData.imageFile ? formData.imageFile.name : 'Pilih file gambar portofolio'}</span>
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
              <span className="block text-[11px] text-neutral-400 mb-1">Preview Foto:</span>
              <div className="w-full h-48 rounded-xl overflow-hidden bg-[#262626] border border-[#3a3a3a]">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
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
              <span>{selectedItem ? 'Simpan Perubahan' : 'Unggah Foto'}</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Modal Batch Upload */}
      <AdminModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        title="Upload Batch Foto Portofolio"
      >
        <form onSubmit={handleBatchSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Pilih Kategori Target *
            </label>
            <select
              value={batchCategory}
              onChange={(e) => setBatchCategory(e.target.value)}
              className="w-full bg-[#262626] border border-[#3a3a3a] text-neutral-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label || c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Pilih Beberapa Foto Sekaligus (Maks 20 file) *
            </label>
            <label className="flex flex-col items-center justify-center p-6 rounded-2xl bg-[#262626] border-2 border-dashed border-[#444] hover:border-primary cursor-pointer transition-colors text-center">
              <Upload size={32} className="text-primary mb-2" />
              <p className="text-sm font-semibold text-neutral-200">
                {batchFiles.length > 0
                  ? `${batchFiles.length} file dipilih`
                  : 'Klik untuk memilih banyak foto'}
              </p>
              <p className="text-xs text-neutral-500 mt-1">Format: JPG, PNG, WEBP</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Batch Preview Grid */}
          {batchPreviews.length > 0 && (
            <div>
              <span className="block text-[11px] text-neutral-400 mb-2">
                Preview ({batchPreviews.length} foto):
              </span>
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
                {batchPreviews.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700">
                    <img src={src} alt="Batch Preview" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-[#2e2e2e]">
            <button
              type="button"
              onClick={() => setIsBatchOpen(false)}
              className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || batchFiles.length === 0}
              className="px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center gap-2 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>Unggah Semua Foto</span>
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Foto Portofolio"
        message={`Apakah Anda yakin ingin menghapus foto "${selectedItem?.title}" dari galeri studio?`}
        loading={submitting}
      />
    </div>
  );
}
