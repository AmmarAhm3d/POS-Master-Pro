import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { GenericTable } from '../components/GenericTable';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // State for the form
  const [formData, setFormData] = useState({ id: 0, name: '', code: '', costPrice: 0, retailPrice: 0 });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.products.getPaged(page, pageSize);
      setProducts(response.data || []);
      setTotalCount(response.totalCount || 0);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // OPEN MODAL FOR CREATE
  const openCreateModal = () => {
    setFormData({ id: 0, name: '', code: '', costPrice: 0, retailPrice: 0 });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // OPEN MODAL FOR EDIT
  const openEditModal = (product) => {
    setFormData({ ...product }); // Copy product data to form
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.products.update(formData);
        toast.success("Product updated!");
      } else {
        await api.products.create(formData);
        toast.success("Product created!");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await api.products.delete(id);
        Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        fetchProducts();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  const columns = [
    { header: 'Code', accessor: 'code', className: 'font-mono text-gray-500' },
    { header: 'Name', accessor: 'name', className: 'font-bold' },
    { header: 'Cost', accessor: 'costPrice', render: (p) => `$${p.costPrice.toFixed(2)}` },
    { header: 'Retail', accessor: 'retailPrice', render: (p) => <span className="text-brand font-bold">${p.retailPrice.toFixed(2)}</span> },
    { header: 'Action', render: (p) => (
        <div className="flex justify-end gap-2">
            {/* EDIT BUTTON */}
            <button onClick={() => openEditModal(p)} className="text-blue-500 hover:bg-blue-50 p-2 rounded transition">
                <i className="fas fa-edit"></i>
            </button>
            {/* DELETE BUTTON */}
            <button onClick={() => p.id && handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition">
                <i className="fas fa-trash"></i>
            </button>
        </div>
      ), className: 'text-right' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={openCreateModal} className="bg-brand text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          <i className="fas fa-plus mr-2"></i>New Product
        </button>
      </div>

      <GenericTable 
        data={products} 
        columns={columns} 
        isLoading={loading}
        pagination={{
            currentPage: page,
            pageSize: pageSize,
            totalCount: totalCount,
            onPageChange: (newPage) => setPage(newPage)
        }} 
      />


      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSave} className="space-y-4">
            <input required type="text" placeholder="Name" className="w-full border p-2 rounded" 
            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="text" placeholder="Code" className="w-full border p-2 rounded" 
            value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
            <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Cost" className="border p-2 rounded" 
                value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: Number(e.target.value)})} />
            <input required type="number" placeholder="Retail" className="border p-2 rounded" 
                value={formData.retailPrice} onChange={e => setFormData({...formData, retailPrice: Number(e.target.value)})} />
            </div>
            <div className="flex gap-2 justify-end mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
            <button type="submit" className="bg-brand text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                {isEditing ? 'Update' : 'Save'}
            </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManager;