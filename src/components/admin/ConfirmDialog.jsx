import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import AdminModal from './AdminModal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus',
  message = 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
  confirmText = 'Hapus Sekarang',
  cancelText = 'Batal',
  loading = false,
  danger = true,
}) {
  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full shrink-0 ${danger ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400'}`}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <p className="text-sm text-neutral-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-[#2e2e2e]">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 ${
            danger
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-primary hover:bg-primary-dark'
          }`}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {confirmText}
        </button>
      </div>
    </AdminModal>
  );
}
