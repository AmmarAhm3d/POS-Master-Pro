import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  // Add Item to Cart (or update quantity if exists)
  const addToCart = (product) => {
    setCart(current => {
        const existingIndex = current.findIndex(item => item.productId === product.id);
        
        if (existingIndex >= 0) {
            // MERGE: Update quantity of existing item
            const updatedCart = [...current];
            const item = { ...updatedCart[existingIndex] };
            
            item.quantity += 1;
            const gross = item.quantity * item.unitPrice;
            item.discount = gross * (item.uiDiscountPercent / 100);
            item.lineTotal = gross - item.discount;
            
            updatedCart[existingIndex] = item;
            toast.success(`Increased quantity of ${product.name}`);
            return updatedCart;
        } else {
            // ADD NEW
            const newItem = {
              productId: product.id,
              productName: product.name,
              quantity: 1,
              unitPrice: product.retailPrice,
              discount: 0, 
              lineTotal: product.retailPrice,
              uiDiscountPercent: 0
            };
            toast.success("Item Added");
            return [...current, newItem];
        }
    });
  };

  // Update Quantity
  const updateQuantity = (index, newQtyStr) => {
    const newQty = Number(newQtyStr);
    if (newQty < 1 || isNaN(newQty)) return; 

    setCart(currentCart => {
        const updatedCart = [...currentCart];
        const item = { ...updatedCart[index] };
        
        item.quantity = newQty;
        const gross = item.quantity * item.unitPrice;
        item.discount = gross * (item.uiDiscountPercent / 100);
        item.lineTotal = gross - item.discount;
        
        updatedCart[index] = item;
        return updatedCart;
    });
  };

  // Update Discount
  const updateDiscount = (index, newPercentStr) => {
    const newPercent = Number(newPercentStr);
    if (newPercent < 0 || newPercent > 100 || isNaN(newPercent)) return;

    setCart(currentCart => {
        const updatedCart = [...currentCart];
        const item = { ...updatedCart[index] };

        item.uiDiscountPercent = newPercent;
        const gross = item.quantity * item.unitPrice;
        item.discount = gross * (newPercent / 100);
        item.lineTotal = gross - item.discount;

        updatedCart[index] = item;
        return updatedCart;
    });
  };

  // Remove Item
  const removeFromCart = async (index) => {
    const result = await Swal.fire({
        title: 'Remove item?', icon: 'warning', showCancelButton: true,
        confirmButtonColor: '#d33', confirmButtonText: 'Yes, remove'
    });
    if (result.isConfirmed) {
        setCart(cart.filter((_, i) => i !== index));
        toast.success('Removed');
    }
  };

  // Clear Cart
  const clearCart = () => setCart([]);

  // Calculate Grand Total
  const grandTotal = useMemo(() => cart.reduce((sum, item) => sum + item.lineTotal, 0), [cart]);

  return {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    updateDiscount,
    removeFromCart,
    clearCart,
    grandTotal
  };
};
