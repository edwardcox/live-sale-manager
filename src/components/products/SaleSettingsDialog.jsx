import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { updateProductMetafields } from '../../lib/shopify';

const SaleSettingsDialog = ({ product, onClose, onUpdate }) => {
  const [settings, setSettings] = useState({
    onSale: product.metafields.onSale,
    onSalePercentOff: product.metafields.onSalePercentOff,
    onSaleImage: product.metafields.onSaleImage || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await updateProductMetafields(product.id, settings);
      onUpdate();
      onClose();
    } catch (err) {
      setError('Failed to update sale settings. Please try again.');
      console.error('Error updating sale settings:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Sale Settings - {product.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="onSale"
                name="onSale"
                checked={settings.onSale}
                onChange={(e) => handleChange({
                  target: { name: 'onSale', value: e.target.checked }
                })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="onSale" className="text-sm font-medium">
                Product is on sale
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Percentage
              </label>
              <Input
                type="number"
                name="onSalePercentOff"
                value={settings.onSalePercentOff}
                onChange={handleChange}
                min="0"
                max="100"
                disabled={!settings.onSale}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter a value between 0 and 100
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Sale Image URL
              </label>
              <Input
                type="url"
                name="onSaleImage"
                value={settings.onSaleImage}
                onChange={handleChange}
                placeholder="https://example.com/sale-image.jpg"
                disabled={!settings.onSale}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Optional: URL for the image to display when product is on sale
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 p-3 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleSettingsDialog;