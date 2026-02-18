import React from 'react';

// Removed strict interface <T>
export const GenericTable = ({ 
  data, 
  columns, 
  isLoading = false,
  emptyMessage = "No records found",
  pagination = null,
  onRowDoubleClick 
}) => {
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      {columns.map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} className="p-10 text-center text-gray-400">{emptyMessage}</td></tr>
          ) : (
            data.map((item, rowIdx) => (
              <tr 
                  key={item.id || rowIdx} 
                  className={`hover:bg-gray-50 transition-colors ${onRowDoubleClick ? 'cursor-pointer' : ''}`}
                  onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(item)}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {/* Render custom content OR the raw value */}
                    {col.render ? col.render(item) : (col.accessor ? String(item[col.accessor]) : '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
      
      {/* Pagination Footer */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to <span className="font-medium">{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)}</span> of <span className="font-medium">{pagination.totalCount}</span> results
          </div>
          <div className="flex gap-2">
            <button 
              disabled={pagination.currentPage === 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              className="px-3 py-1 text-sm border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span className="px-3 py-1 text-sm bg-white border rounded">
              Page {pagination.currentPage}
            </span>
            <button 
              disabled={pagination.currentPage * pagination.pageSize >= pagination.totalCount}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              className="px-3 py-1 text-sm border rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default GenericTable;