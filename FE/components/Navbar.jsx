import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => 
    location.pathname === path ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-600 hover:text-white';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="bg-brand text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <i className="fas fa-cash-register text-2xl"></i>
                <span className="font-bold text-xl tracking-tight">POS MASTER PRO</span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/')}`}>
                    <i className="fas fa-shopping-cart mr-2"></i>Point of Sale
                  </Link>
                  <Link to="/products" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/products')}`}>
                    <i className="fas fa-boxes mr-2"></i>Products
                  </Link>
                  <Link to="/people" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/people')}`}>
                    <i className="fas fa-users mr-2"></i>Sales People
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-600 focus:outline-none transition"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
              </button>

              <div className="hidden sm:flex w-8 h-8 rounded-full bg-blue-400 items-center justify-center border-2 border-white/20">
                <i className="fas fa-user-shield text-xs"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-64 border-t border-blue-600' : 'max-h-0'}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-brand">
            <Link 
              to="/" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition ${isActive('/')}`}
            >
              <i className="fas fa-shopping-cart mr-3"></i>Point of Sale
            </Link>
            <Link 
              to="/products" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition ${isActive('/products')}`}
            >
              <i className="fas fa-boxes mr-3"></i>Products
            </Link>
            <Link 
              to="/people" 
              onClick={closeMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium transition ${isActive('/people')}`}
            >
              <i className="fas fa-users mr-3"></i>Sales People
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;