import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PointOfSale from './pages/PointOfSale';
import ProductManager from './pages/ProductManager';
import PeopleManager from './pages/PeopleManager';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Toaster position="top-right" reverseOrder={false} />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<PointOfSale />} />
            <Route path="/products" element={<ProductManager />} />
            <Route path="/people" element={<PeopleManager />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} POS Master Pro. All rights reserved. Professional Series.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;