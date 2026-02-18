import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api';
import SalesHistory from '../components/SalesHistory'; 
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useCart } from '../hooks/useCart';

const PointOfSale = () => {
  const [activeTab, setActiveTab] = useState('sales');
  
  // === Data State ===
  const [people, setPeople] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // === Header State ===
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [personId, setPersonId] = useState(0);
  const [comments, setComments] = useState('');

  // === Add Item State ===
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const searchRef = useRef(null);

  // === Cart State ===
  const { cart, setCart, addToCart, removeFromCart, updateQuantity, updateDiscount, grandTotal, clearCart } = useCart();
  const [cartSearch, setCartSearch] = useState('');

  // 1. Add state for editing
  const [editingSaleId, setEditingSaleId] = useState(null);

  // 2. Create the function to load a sale
  const handleEditSale = async (id) => {
    try {
        setLoading(true);
        const sale = await api.sales.getById(id);
        
        if (sale) {
            // Populate State
            setEditingSaleId(sale.id);
            setTransactionDate(new Date(sale.transactionDate));
            setPersonId(sale.personId);
            setComments(sale.comments);
            
            // Map details to Cart Items
            const cartItems = sale.saleDetails.map(d => ({
                productId: d.productId,
                productName: d.productName,
                quantity: d.quantity,
                unitPrice: d.unitPrice,
                discount: d.discount,
                lineTotal: d.lineTotal,
                // Reverse engineer the % for the UI input
                uiDiscountPercent: d.unitPrice > 0 ? (d.discount / (d.quantity * d.unitPrice)) * 100 : 0
            }));
            
            setCart(cartItems);
            
            // Switch Tab
            setActiveTab('sales');
            toast.success("Sale loaded for editing");
        }
    } catch (err) {
        toast.error("Failed to load sale");
    } finally {
        setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [peopleData, productsData] = await Promise.all([
          api.people.getAll(),
          api.products.getAll()
        ]);
        setPeople(peopleData);
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to connect to backend");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Real-Time Clock
  useEffect(() => {
    if (isTimeLocked) return;
    const timer = setInterval(() => setTransactionDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isTimeLocked]);

  // Close Dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Logic Helpers ---

  const handleSelectProduct = (product) => {
    addToCart(product);
    // Reset Search
    setProductSearch('');
    setShowProductDropdown(false);
    setIsProductModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
    p.code.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Handle Complete Sale
  const handleCompleteSale = async () => {
    if (personId === 0) return toast.error('Select a sales person');
    if (cart.length === 0) return toast.error('Cart is empty');

    const result = await Swal.fire({
        title: editingSaleId ? 'Update Transaction?' : 'Complete Transaction?',
        html: `<div class="text-xl">Total: <b>$${grandTotal.toFixed(2)}</b></div>`,
        icon: 'question', showCancelButton: true, 
        confirmButtonText: editingSaleId ? 'Update' : 'Pay Now', 
        confirmButtonColor: '#007bff'
    });

    if (!result.isConfirmed) return;

    const apiDetails = cart.map(({ uiDiscountPercent, ...rest }) => rest);

    const payload = {
        id: editingSaleId || 0,
        transactionDate: new Date(transactionDate.getTime() - (transactionDate.getTimezoneOffset() * 60000)).toISOString(),
        personId,
        totalAmount: grandTotal,
        comments, 
        saleDetails: apiDetails
    };

    try {
        if (editingSaleId) {
            await api.sales.update(payload);
            Swal.fire('Updated!', 'Transaction updated successfully.', 'success');
        } else {
            await api.sales.create(payload);
            Swal.fire('Success!', 'Transaction saved.', 'success');
        }
        
        // Reset
        setCart([]); setComments(''); setEditingSaleId(null); 
        setProductSearch('');
    } catch (err) {
    }
  };

  const handleDeleteSale = async () => {
    const result = await Swal.fire({
        title: 'Delete this sale?',
        text: "This cannot be undone!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed && editingSaleId) {
        try {
            await api.sales.delete(editingSaleId);
            Swal.fire('Deleted!', 'Sale has been deleted.', 'success');
            handleClearSale();
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    }
  };

  const handleClearSale = () => {
    clearCart();
    setComments(''); 
    setEditingSaleId(null); 
    setProductSearch('');
    // Reset date to now if cleared
    setIsTimeLocked(false);
    setTransactionDate(new Date());
  };

  if (loading && people.length === 0) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      
      <div className="flex justify-center mb-6">
        <div className="bg-white border rounded-lg p-1 flex shadow-sm">
            <button onClick={() => setActiveTab('sales')} className={`px-6 py-2 rounded-md font-bold text-sm transition ${activeTab === 'sales' ? 'bg-brand text-white' : 'text-gray-500'}`}>Sales</button>
            <button onClick={() => setActiveTab('record')} className={`px-6 py-2 rounded-md font-bold text-sm transition ${activeTab === 'record' ? 'bg-brand text-white' : 'text-gray-500'}`}>Records</button>
        </div>
      </div>

      {activeTab === 'record' ? (
        <SalesHistory onEdit={handleEditSale} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-brand font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2">Header</h2>
              <div className="space-y-3">
                <div>
                    <div className="flex gap-2">
                        <input type="datetime-local" className="w-full border p-2 rounded text-sm font-mono" 
                            value={new Date(transactionDate.getTime() - (transactionDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 19)} 
                            onChange={e => { setIsTimeLocked(true); setTransactionDate(new Date(e.target.value)); }} />
                        {isTimeLocked && <button onClick={() => setIsTimeLocked(false)} className="text-xs bg-gray-100 px-2 rounded border"><i className="fas fa-clock"></i></button>}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Sales Person</label>
                    <select className="w-full border p-2 rounded text-sm" value={personId} onChange={e => setPersonId(Number(e.target.value))}>
                        <option value={0}>Select...</option>
                        {people.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                    </select>
                </div>
                <textarea className="w-full border p-2 rounded text-sm resize-none" rows={2} placeholder="Notes..." value={comments} onChange={e => setComments(e.target.value)} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-brand font-bold text-sm uppercase tracking-wider mb-4 border-b pb-2">Add Item</h2>
              <div className="space-y-3">
                <div className="relative" ref={searchRef}>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Product</label>
                    <div className="flex gap-2">
                        <div className="relative flex-grow">
                            <input type="text" className="w-full border p-2 pl-8 rounded text-sm" placeholder="Scan/Search..."
                                value={productSearch}
                                onChange={e => { 
                                    setProductSearch(e.target.value); 
                                    setShowProductDropdown(e.target.value.length > 0); 
                                }}
                                onClick={() => { if(productSearch.length > 0) setShowProductDropdown(true); }}
                             />
                            <i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-xs"></i>
                        </div>
                        <button onClick={() => setIsProductModalOpen(true)} className="bg-brand text-white px-3 rounded hover:bg-blue-700 transition">
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
                    {showProductDropdown && (productSearch.length > 0 || products.length > 0) && (
                        <div className="absolute z-10 w-full bg-white border rounded-lg shadow-xl max-h-48 overflow-y-auto mt-1">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="p-2 hover:bg-blue-50 cursor-pointer border-b flex justify-between items-center" onClick={() => handleSelectProduct(p)}>
                                    <div><div className="font-bold text-sm">{p.name}</div><div className="text-xs text-gray-500">{p.code}</div></div>
                                    <div className="font-bold text-brand text-sm">${p.retailPrice}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-grow flex flex-col h-full min-h-[400px]">
                <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-700">Shopping Cart</h3>
                    <div className="flex items-center gap-2">
                         <input 
                            type="text" 
                            className="text-xs border rounded px-2 py-1 w-32 focus:w-48 transition-all" 
                            placeholder="Filter cart..."
                            value={cartSearch}
                            onChange={(e) => setCartSearch(e.target.value)}
                         />
                        <span className="bg-blue-100 text-brand text-xs font-bold px-2 py-1 rounded-full">{cart.length} Items</span>
                    </div>
                </div>
               
               <div className="flex-grow overflow-auto">
                   <table className="min-w-full">
                      <thead className="bg-white sticky top-0 border-b z-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase w-1/3">Item</th>
                            <th className="px-2 py-3 text-center text-xs font-bold text-gray-500 uppercase w-1/6">Qty</th>
                            <th className="px-2 py-3 text-right text-xs font-bold text-gray-500 uppercase w-1/6">Price</th>
                            <th className="px-2 py-3 text-center text-xs font-bold text-gray-500 uppercase w-1/6">Disc %</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase w-1/6">Total</th>
                            <th className="px-2 py-3 w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {cart.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-10 text-center text-gray-400 italic">
                                    <div className="flex flex-col items-center justify-center opacity-50">
                                        <i className="fas fa-shopping-cart text-6xl mb-4 text-gray-300"></i>
                                        <div className="text-lg">Cart is empty</div>
                                        <div className="text-xs">Search for products to add them</div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            cart.filter(item => item.productName.toLowerCase().includes(cartSearch.toLowerCase())).map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-3"><div className="font-bold text-gray-800 text-sm">{item.productName}</div></td>
                                    
                                    <td className="px-2 py-3 text-center">
                                        <input type="number" min="1" className="w-16 border rounded p-1 text-center text-sm font-bold focus:ring-2 focus:ring-brand outline-none"
                                            value={item.quantity}
                                            onChange={e => updateQuantity(idx, e.target.value)}
                                        />
                                    </td>
                                    
                                    <td className="px-2 py-3 text-right text-sm text-gray-500">${item.unitPrice.toFixed(2)}</td>
                                    
                                    <td className="px-2 py-3 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <input type="number" min="0" max="100" className="w-12 border rounded p-1 text-center text-sm text-red-500 font-bold focus:ring-2 focus:ring-red-500 outline-none"
                                                value={item.uiDiscountPercent}
                                                onChange={e => updateDiscount(idx, e.target.value)}
                                            />
                                            <span className="text-xs text-red-500 font-bold">%</span>
                                        </div>
                                        <div className="text-xs text-gray-400 text-center mt-1">(-${item.discount.toFixed(2)})</div>
                                    </td>
                                    
                                    <td className="px-6 py-3 text-right text-sm font-black text-gray-900">${item.lineTotal.toFixed(2)}</td>
                                    <td className="px-2 py-3 text-center">
                                        <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><i className="fas fa-times-circle"></i></button>
                                    </td>
                                </tr>
                            ))
                        )}
                      </tbody>
                   </table>
               </div>

               <div className="bg-gray-50 border-t p-6">
                    <div className="flex justify-between items-end">
                        <div className="text-sm text-gray-500">
                            <div>Items: <span className="font-bold text-gray-800">{cart.length}</span></div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Total Payable</div>
                            <div className="text-4xl font-black text-brand tracking-tight">${grandTotal.toFixed(2)}</div>
                        </div>
                    </div>
                    <button 
                        onClick={handleCompleteSale} 
                        className={`mt-6 w-full text-white py-4 rounded-xl font-bold text-lg shadow-lg transition flex justify-center items-center gap-2 ${
                            editingSaleId ? 'bg-blue-600 hover:bg-blue-800' : 'bg-brand hover:bg-blue-800'
                        }`}
                        disabled={cart.length === 0}
                    >
                        <span>{editingSaleId ? 'UPDATE TRANSACTION' : 'COMPLETE TRANSACTION'}</span>
                        <i className={`fas ${editingSaleId ? 'fa-save' : 'fa-arrow-right'}`}></i>
                    </button>
               </div>
               
               {/* ACTION BUTTONS ROW */}
               <div className="bg-gray-50 border-t p-6 pt-0 flex gap-4">
                    {editingSaleId && (
                        <button 
                            onClick={handleDeleteSale} 
                            className="flex-1 bg-red-500 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow transition"
                        >
                            Delete Sale
                        </button>
                    )}
                    <button 
                        onClick={handleClearSale} 
                        className="flex-1 bg-gray-500 hover:bg-gray-700 text-white py-3 rounded-xl font-bold shadow transition"
                    >
                        {editingSaleId ? 'New Sale' : 'Clear'}
                    </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT SELECTION MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Select Product</h2>
                    <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
                </div>
                <div className="mb-4">
                     <input type="text" className="w-full border p-3 rounded-lg text-sm bg-gray-50" placeholder="Search products..."
                        autoFocus
                        onChange={e => setProductSearch(e.target.value)} 
                     />
                </div>
                <div className="flex-grow overflow-y-auto border rounded-xl">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Code</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Price</th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.code.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                                <tr key={p.id} className="hover:bg-blue-50 cursor-pointer transition" onClick={() => handleSelectProduct(p)}>
                                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{p.code}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-gray-800">{p.name}</td>
                                    <td className="px-4 py-3 text-sm font-bold text-brand text-right">${p.retailPrice.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="bg-brand text-white text-xs px-3 py-1 rounded hover:bg-blue-700">Add</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
export default PointOfSale;