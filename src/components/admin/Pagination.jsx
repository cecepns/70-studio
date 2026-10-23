import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate page numbers to display with smart ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const delta = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-sm text-neutral-400">
      {/* Items counter and Limit Selector */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <span>
          Menampilkan <strong className="text-neutral-200">{startItem}-{endItem}</strong> dari <strong className="text-neutral-200">{totalItems}</strong> data
        </span>

        {onLimitChange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Per hal:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-[#262626] border border-[#3a3a3a] text-neutral-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}
      </div>

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 self-center">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Halaman Sebelumnya"
            className="p-1.5 rounded-lg border border-[#333333] bg-[#222222] text-neutral-300 hover:bg-[#2e2e2e] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`dots-${idx}`} className="px-2 text-neutral-500">
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`min-w-[34px] h-[34px] flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white border border-primary/50 shadow-md shadow-primary/20'
                    : 'border border-[#333333] bg-[#222222] text-neutral-300 hover:bg-[#2e2e2e] hover:text-white'
                }`}
              >
                {page}
              </button>
            );
          })}

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Halaman Berikutnya"
            className="p-1.5 rounded-lg border border-[#333333] bg-[#222222] text-neutral-300 hover:bg-[#2e2e2e] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
