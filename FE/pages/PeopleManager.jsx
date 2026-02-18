import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { GenericTable } from '../components/GenericTable';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';

const PeopleManager = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  // State for form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, [page]); // Fetch when page changes

  const fetchPeople = async () => {
    try {
      setLoading(true);
      const response = await api.people.getPaged(page, pageSize);
      setPeople(response.data || []);
      setTotalCount(response.totalCount || 0);
    } catch (err) {
      toast.error(`Error loading people: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // OPEN CREATE
  const openCreateModal = () => {
    reset({ firstName: '', lastName: '', email: '', phoneNumber: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  // OPEN EDIT
  const openEditModal = (person) => {
    setValue('firstName', person.firstName);
    setValue('lastName', person.lastName);
    setValue('email', person.email);
    setValue('phoneNumber', person.phoneNumber);
    setEditingId(person.id);
    setIsModalOpen(true);
  };

  const onSubmit = async (data) => {
    try { 
      if (editingId) {
        // Backend expects 'Id' (PascalCase) for strict binding or 'id' but let's send both to be safe
        await api.people.update({ ...data, id: editingId, Id: editingId });
        toast.success('Person updated successfully');
      } else {
        await api.people.create(data); 
        toast.success('Person created successfully');
      }
      setIsModalOpen(false); 
      fetchPeople(); 
    } catch (err) { 
      toast.error(`Failed: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try { 
        await api.people.delete(id); 
        Swal.fire('Deleted!', 'Person has been deleted.', 'success');
        fetchPeople(); 
      } catch (err) { 
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  // --- UPDATED COLUMNS DEFINITION ---
  const columns = [
    { 
      header: 'Name', 
      render: (p) => <span className="font-bold text-gray-800">{p.firstName} {p.lastName}</span> 
    },
    { 
      header: 'Email', 
      accessor: 'email', 
      className: 'text-gray-600' 
    },
    { 
      header: 'Phone', 
      accessor: 'phoneNumber', 
      className: 'text-gray-500 font-mono text-xs' 
    },
    { 
      header: 'Action', 
      render: (p) => (
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
      ), 
      className: 'text-right' 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales People</h1>
        <button onClick={openCreateModal} className="bg-brand text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          <i className="fas fa-user-plus mr-2"></i>Add Person
        </button>
      </div>

      <GenericTable 
        data={people} 
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
        title={editingId ? 'Edit Person' : 'Add Sales Person'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input type="text" placeholder="First Name" className={`w-full border p-2 rounded ${errors.firstName ? 'border-red-500' : ''}`} 
                  {...register('firstName', { required: 'First name is required' })} />
                {errors.firstName && <span className="text-red-500 text-xs">{errors.firstName.message}</span>}
              </div>
              <div>
                <input type="text" placeholder="Last Name" className={`w-full border p-2 rounded ${errors.lastName ? 'border-red-500' : ''}`} 
                  {...register('lastName', { required: 'Last name is required' })} />
                {errors.lastName && <span className="text-red-500 text-xs">{errors.lastName.message}</span>}
              </div>
            </div>
            
            <div>
              <input type="email" placeholder="Email" className={`w-full border p-2 rounded ${errors.email ? 'border-red-500' : ''}`} 
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })} />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
            
            <div>
              <input type="tel" placeholder="Phone" className={`w-full border p-2 rounded ${errors.phoneNumber ? 'border-red-500' : ''}`} 
                {...register('phoneNumber', { required: 'Phone is required' })} />
              {errors.phoneNumber && <span className="text-red-500 text-xs">{errors.phoneNumber.message}</span>}
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded">Cancel</button>
              <button type="submit" className="bg-brand text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
                  {editingId ? 'Update' : 'Create'}
              </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default PeopleManager;