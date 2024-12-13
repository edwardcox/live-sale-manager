import React, { useState } from 'react';
import { useSelection } from '../../context/SelectionContext';
import { Button } from '../../components/ui/button';
import { Tag, CheckSquare, Square, Percent, Settings } from 'lucide-react';
import PresetSettingsDialog from './PresetSettingsDialog';
import { updateProductMetafields } from '../../lib/shopify';

const BulkActions = ({ products, onRefresh }) => {
  const [showPresets, setShowPresets] = useState(false);
  const { selectedProducts, selectAll, clearSelection, selectionCount } = useSelection();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectAll = () => {
    const allProductIds = products.map(product => product.id);
    selectAll(allProductIds);
  };

  const handleBulkSaleToggle = async (saleState) => {
    setIsUpdating(true);
    try {
      const updates = Array.from(selectedProducts).map(productId => 
        updateProductMetafields(productId, {
          onSale: saleState,
          onSalePercentOff: saleState ? 39 : 0, // Default percentage
          onSaleImage: saleState ? 
            'https://cdn.shopify.com/s/files/1/0541/0232/7477/files/only-3-days-sign.png' : ''
        })
      );

      await Promise.all(updates);
      clearSelection();
      onRefresh();
    } catch (error) {
      console.error('Error updating products:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm mb-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="flex items-center space-x-2"
        >
          <CheckSquare className="h-4 w-4" />
          <span>Select All</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={clearSelection}
          className="flex items-center space-x-2"
        >
          <Square className="h-4 w-4" />
          <span>Clear Selection</span>
        </Button>

        <div className="text-sm text-gray-500">
          {selectionCount} products selected
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBulkSaleToggle(true)}
          disabled={selectionCount === 0 || isUpdating}
          className="flex items-center space-x-2 text-green-600 hover:text-green-700"
        >
          <Tag className="h-4 w-4" />
          <span>Add to Sale</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleBulkSaleToggle(false)}
          disabled={selectionCount === 0 || isUpdating}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700"
        >
          <Percent className="h-4 w-4" />
          <span>Remove from Sale</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPresets(true)}
          className="flex items-center space-x-2 ml-2"
        >
          <Settings className="h-4 w-4" />
          <span>Presets</span>
        </Button>
      </div>

      {showPresets && (
        <PresetSettingsDialog
          onClose={() => setShowPresets(false)}
          onApply={async (presetProducts) => {
            setIsUpdating(true);
            try {
              const updates = presetProducts.map(product => 
                updateProductMetafields(product.id, {
                  onSale: product.onSale,
                  onSalePercentOff: product.onSalePercentOff,
                  onSaleImage: product.onSaleImage
                })
              );
              await Promise.all(updates);
              onRefresh();
            } catch (error) {
              console.error('Error applying preset:', error);
            } finally {
              setIsUpdating(false);
            }
          }}
          currentProducts={products}
        />
      )}
    </div>
  );
};

export default BulkActions;