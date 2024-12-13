import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import useProducts from '../../hooks/useProducts';
import ProductTableRow from './ProductTableRow';
import { useSelection } from '../../context/SelectionContext';

const ProductTable = () => {
  const { products, loading, error, refreshProducts } = useProducts();
  const { selectAll, clearSelection, selectedProducts } = useSelection();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      selectAll(filteredProducts.map(product => product.id));
    } else {
      clearSelection();
    }
  };

  const allSelected = filteredProducts.length > 0 && 
    filteredProducts.every(product => selectedProducts.has(product.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {filteredProducts.length} products
          </span>
          <button
            onClick={refreshProducts}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
            title="Refresh products"
          >
            <RefreshCw className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAllChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableHead>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Price</TableHead>
                <TableHead className="w-[120px]">Sale Price</TableHead>
                <TableHead className="w-[100px]">On Sale</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <td colSpan={8} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  </td>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <td colSpan={8} className="text-center py-8">
                    <div className="text-red-600">{error}</div>
                  </td>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <td colSpan={8} className="text-center py-8">
                    <div className="text-gray-500">No products found</div>
                  </td>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <ProductTableRow 
                    key={product.id} 
                    product={product}
                    onRefresh={refreshProducts}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;