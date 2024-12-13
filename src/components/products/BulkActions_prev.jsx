import React, { useState } from 'react';
import { CheckSquare, Square, Tag, Percent, X } from 'lucide-react';
import { useSelection } from '../../context/SelectionContext';
import { updateProductMetafields } from '../../lib/shopify';

const BulkActions = ({ products, onUpdate }) => {
  const { selectedProducts, clearSelection, selectionCount } = useSelection();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showBulkSaleDialog, setShowBulkSaleDialog] = useState(false);
  const [salePercentage, setSalePercentage] = useState(0);

  const handleBulkSale = async (percentage) => {
    setIsUpdating(true);
    try {
      const updatePromises = Array.from(selectedProducts).map(productId => {
        const product = products.find(p => p.id === productId);
        return updateProductMetafields(productId, {
          onSale: true,
          onSalePercentOff: percentage,
          onSaleImage: product?.metafields?.onSaleImage || ''
        });
      });

      await Promise.all(updatePromises);
      clearSelection();
      onUpdate();
    } catch (error) {
      console.error('Error applying bulk sale:', error);
    } finally {
      setIsUpdating(false);
      setShowBulkSaleDialog(false);
    }
  };

  const handleBulkRemoveSale = async () => {
    setIsUpdating(true);
    try {
      const updatePromises = Array.from(selectedProducts).map(productId => 
        updateProductMetafields(productId, {
          onSale: false,
          onSalePercentOff: 0,
          onSaleImage: ''
        })
      );

      await Promise.all(updatePromises);
      clearSelection();
      onUpdate();
    } catch (error) {
      console.error('Error removing bulk sale:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (selectionCount === 0) return null;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CheckSquare className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium">
            {selectionCount} product{selectionCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBulkSaleDialog(true)}
            disabled={isUpdating}
            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
          >
            <Tag className="h-4 w-4" />
            <span>Set Sale</span>
          </button>
          
          <button
            onClick={handleBulkRemoveSale}
            disabled={isUpdating}
            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Remove Sale</span>
          </button>
          
          <button
            onClick={clearSelection}
            disabled={isUpdating}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Square className="h-4 w-4" />
            <span>Clear Selection</span>
          </button>
        </div>
      </div>

      {/* Bulk Sale Dialog */}
      {showBulkSaleDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Set Bulk Sale Percentage</h3>
            
            <div className="flex items-center space-x-2 mb-6">
              <input
                type="number"
                value={salePercentage}
                onChange={(e) => setSalePercentage(parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
              <Percent className="h-5 w-5 text-gray-500" />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowBulkSaleDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBulkSale(salePercentage)}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {isUpdating ? 'Applying...' : 'Apply Sale'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;