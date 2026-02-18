import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { GenericTable } from './GenericTable';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const SalesHistory = ({onEdit}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
        loadHistory();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, page]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await api.sales.getPaged(page, pageSize, search);
      setHistory(response.data || []);
      setTotalCount(response.totalCount || 0);
    } catch (err) {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Prevent row click
    
    // Use SweetAlert instead of window.confirm
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;
    
    try {
        await api.sales.delete(id);
        toast.success("Sale deleted");
        loadHistory();
    } catch (err) {
        toast.error(err.message);
    }
  };

  // Filter Logic (Applied to current page data only for now, as API does not support search yet)
  // Filter Logic Removed - Handled by API
  const filteredData = history;

  // Define Columns
  const columns = [
    { header: 'Date', accessor: 'transactionDate', render: (item) => new Date(item.transactionDate).toLocaleString() },
    { header: 'Sales Person', accessor: 'salesPersonName' },
    { header: 'Comments', accessor: 'comments', render: (item) => <span className="italic text-gray-500">{item.comments || '-'}</span> },
    { header: 'Total', accessor: 'totalAmount', render: (item) => <span className="font-bold text-brand">${item.totalAmount.toFixed(2)}</span>, className: 'text-right' },
    { header: 'Action', render: (item) => (
      <div className="flex justify-end gap-2">
        <button 
            onClick={(e) => { e.stopPropagation(); onEdit(item.id); }} 
            className="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-3 py-1 rounded transition"
        >
            EDIT
        </button>
        <button 
            onClick={(e) => handleDelete(item.id, e)} 
            className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-3 py-1 rounded transition"
        >
            DELETE
        </button>
      </div>
    ), className: 'text-right' 
  }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
        <h2 className="font-bold text-gray-700">Recent Transactions</h2>
        <input 
          type="text" 
          placeholder="Search records..." 
          className="border rounded px-3 py-2 text-sm w-64"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>
      <GenericTable 
        data={filteredData} 
        columns={columns} 
        isLoading={loading} 
        emptyMessage="No sales records found."
        pagination={{
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            onPageChange: (newPage) => setPage(newPage)
        }} 
        onRowDoubleClick={(item) => onEdit(item.id)}
      />
    </div>
  );
};

export default SalesHistory;