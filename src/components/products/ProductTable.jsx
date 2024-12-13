import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody } from "../../components/ui/table";
import ProductTableRow from './ProductTableRow';
import BulkActions from './BulkActions';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';

const ProductTable = ({ products = [], onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Handle loading state
  if (!Array.isArray(products)) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  // Memoize filtered products to prevent unnecessary recalculation
  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    
    return products.filter(product => {
      const titleMatch = product.title.toLowerCase().includes(query);
      const handleMatch = product.handle?.toLowerCase().includes(query);
      const statusMatch = product.status?.toLowerCase().includes(query);
      return titleMatch || handleMatch || statusMatch;
    });
  }, [products, searchQuery]);

  return (
    <div className="space-y-4">
      <BulkActions products={products} onRefresh={onRefresh} />
      
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search products by name or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Empty state for no products */}
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">No products found</div>
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Selection</span>
                  </TableHead>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>On Sale</TableHead>
                  <TableHead>% Off</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map(product => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onRefresh={onRefresh}
                  />
                ))}
              </TableBody>
            </Table>

            {/* No search results state */}
            {filteredProducts.length === 0 && searchQuery && (
              <div className="p-8 text-center text-gray-500">
                No products match your search query "{searchQuery}"
              </div>
            )}
          </div>

          {/* Products count */}
          <div className="text-sm text-gray-500 text-right">
            {searchQuery ? (
              <>{filteredProducts.length} of {products.length} products</>
            ) : (
              <>{products.length} products</>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductTable;