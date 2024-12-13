import React from 'react';
import ProductTable from './components/products/ProductTable';
import { SelectionProvider } from './context/SelectionContext';
import useProducts from './hooks/useProducts';

const App = () => {
  const { products, loading, error, refreshProducts } = useProducts();

  return (
    <SelectionProvider>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow mb-8">
          <div className="max-w-7xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Live Sale Manager
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Scintera Pty Ltd - Sale Management Dashboard
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}
          
          <ProductTable 
            products={products} 
            onRefresh={refreshProducts}
            isLoading={loading}
          />
        </main>

        <footer className="mt-8 bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Scintera Pty Ltd. All rights reserved.
          </div>
        </footer>
      </div>
    </SelectionProvider>
  );
};

export default App;