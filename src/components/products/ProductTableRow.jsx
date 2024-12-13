import React, { useState } from 'react';
import { TableCell, TableRow } from "../../components/ui/table";
import { Eye, Edit2, Tag } from "lucide-react";
import { formatPrice, updateProductMetafields } from '../../lib/shopify';
import { useSelection } from '../../context/SelectionContext';
import SaleSettingsDialog from './SaleSettingsDialog';

const ProductTableRow = ({ product, onRefresh }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSaleSettings, setShowSaleSettings] = useState(false);
  const { metafields } = product;
  const { isSelected, toggleProduct } = useSelection();

  const regularPrice = product.variants[0]?.price || 0;
  const salePrice = metafields?.onSale 
    ? regularPrice * (1 - (metafields.onSalePercentOff / 100))
    : null;

  const handleSaleToggle = async () => {
    try {
      setIsUpdating(true);
      await updateProductMetafields(product.id, {
        ...metafields,
        onSale: !metafields.onSale
      });
      onRefresh();
    } catch (error) {
      console.error('Error toggling sale status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TableRow className={metafields?.onSale ? 'bg-green-50/50' : ''}>
      <TableCell className="w-[50px]">
        <input
          type="checkbox"
          checked={isSelected(product.id)}
          onChange={() => toggleProduct(product.id)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </TableCell>
      
      <TableCell className="w-[100px] relative">
        <img
          src={product.image || "/api/placeholder/100/100"}
          alt={product.title}
          className="w-16 h-16 object-cover rounded shadow-sm"
        />
        {metafields?.onSale && (
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              SALE
            </div>
          </div>
        )}
      </TableCell>

      <TableCell>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{product.title}</span>
          {product.variants.length > 1 && (
            <span className="text-sm text-gray-500">
              {product.variants.length} variants
            </span>
          )}
        </div>
      </TableCell>

      <TableCell>
        <span className={metafields?.onSale ? 'text-gray-500 line-through' : 'font-medium'}>
          {formatPrice(regularPrice)}
        </span>
      </TableCell>

      <TableCell>
        {salePrice && (
          <span className="text-red-600 font-medium">
            {formatPrice(salePrice)}
          </span>
        )}
      </TableCell>

      <TableCell>
        <span className={`inline-flex px-2 py-1 rounded-full text-sm ${
          metafields?.onSale 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-500'
        }`}>
          {metafields?.onSale ? 'Yes' : 'No'}
        </span>
      </TableCell>

      <TableCell>
        {metafields?.onSale && (
          <span className="text-sm font-medium text-orange-600">
            {metafields.onSalePercentOff}%
          </span>
        )}
      </TableCell>

      <TableCell>
        <span className={`px-2 py-1 rounded-full text-sm ${
          product.status === 'ACTIVE' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {product.status.toLowerCase()}
        </span>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <button
            onClick={() => window.open(`https://${import.meta.env.VITE_SHOPIFY_STORE_URL}/products/${product.handle}`, '_blank')}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title="View product"
          >
            <Eye className="h-4 w-4 text-gray-500" />
          </button>

          <button
            onClick={() => setShowSaleSettings(true)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title="Edit sale settings"
          >
            <Edit2 className="h-4 w-4 text-gray-500" />
          </button>

          <button
            onClick={handleSaleToggle}
            disabled={isUpdating}
            className={`p-1.5 rounded-full transition-colors ${
              metafields?.onSale 
                ? 'bg-red-100 hover:bg-red-200 text-red-600' 
                : 'hover:bg-green-100 text-gray-500'
            }`}
            title={metafields?.onSale ? 'Remove from sale' : 'Add to sale'}
          >
            <Tag className={`h-4 w-4 ${isUpdating ? 'animate-pulse' : ''}`} />
          </button>
        </div>
      </TableCell>

      {showSaleSettings && (
        <SaleSettingsDialog
          product={product}
          onClose={() => setShowSaleSettings(false)}
          onUpdate={onRefresh}
        />
      )}
    </TableRow>
  );
};

export default ProductTableRow;