import React, { useState, useEffect, useRef } from 'react';
import { X, Save, History, Trash2, Download, Upload } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const PresetSettingsDialog = ({ onClose, onApply, currentProducts }) => {
  const [presets, setPresets] = useState([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [error, setError] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const savedPresets = localStorage.getItem('salePresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  const savePreset = () => {
    if (!newPresetName.trim()) {
      setError('Please enter a preset name');
      return;
    }

    const preset = {
      id: Date.now(),
      name: newPresetName.trim(),
      timestamp: new Date().toISOString(),
      products: currentProducts
        .filter(product => product.metafields?.onSale)
        .map(product => ({
          id: product.id,
          title: product.title,
          onSale: true,
          onSalePercentOff: product.metafields.onSalePercentOff,
          onSaleImage: product.metafields.onSaleImage
        }))
    };

    const updatedPresets = [...presets, preset];
    localStorage.setItem('salePresets', JSON.stringify(updatedPresets));
    setPresets(updatedPresets);
    setNewPresetName('');
    setError(null);
  };

  const deletePreset = (presetId) => {
    setConfirmAction({
      title: 'Delete Preset',
      message: 'Are you sure you want to delete this preset? This action cannot be undone.',
      onConfirm: () => {
        const updatedPresets = presets.filter(preset => preset.id !== presetId);
        localStorage.setItem('salePresets', JSON.stringify(updatedPresets));
        setPresets(updatedPresets);
        setConfirmAction(null);
      }
    });
  };

  const applyPreset = (preset) => {
    setConfirmAction({
      title: 'Apply Preset',
      message: 'Are you sure you want to apply this preset? This will update all products according to the saved configuration.',
      onConfirm: () => {
        onApply(preset.products);
        onClose();
      }
    });
  };

  const exportPresets = () => {
    const dataStr = JSON.stringify(presets, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sale-presets.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importPresets = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedPresets = JSON.parse(e.target.result);
        if (!Array.isArray(importedPresets)) throw new Error('Invalid format');
        
        setConfirmAction({
          title: 'Import Presets',
          message: 'This will add the imported presets to your existing ones. Continue?',
          onConfirm: () => {
            const updatedPresets = [...presets, ...importedPresets];
            localStorage.setItem('salePresets', JSON.stringify(updatedPresets));
            setPresets(updatedPresets);
            setConfirmAction(null);
          }
        });
      } catch (err) {
        setError('Invalid preset file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Sale Presets</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4">
          {/* Save new preset */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Save Current Configuration</h3>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="Enter preset name"
                className="flex-1"
              />
              <Button
                onClick={savePreset}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Import/Export */}
          <div className="mb-6 flex space-x-2">
            <Button
              variant="outline"
              onClick={exportPresets}
              className="flex items-center space-x-2"
              disabled={presets.length === 0}
            >
              <Download className="h-4 w-4" />
              <span>Export Presets</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2"
            >
              <Upload className="h-4 w-4" />
              <span>Import Presets</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={importPresets}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Saved presets */}
          <div>
            <h3 className="text-sm font-medium mb-2">Saved Configurations</h3>
            {presets.length === 0 ? (
              <p className="text-gray-500 text-sm">No saved presets</p>
            ) : (
              <div className="space-y-2">
                {presets.map(preset => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{preset.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(preset.timestamp).toLocaleDateString()} • 
                        {preset.products.length} products
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => applyPreset(preset)}
                        className="flex items-center space-x-1"
                      >
                        <History className="h-4 w-4" />
                        <span>Apply</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePreset(preset.id)}
                        className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmAction && (
        <ConfirmationDialog
          title={confirmAction.title}
          message={confirmAction.message}
          onConfirm={() => {
            confirmAction.onConfirm();
            setConfirmAction(null);
          }}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};

export default PresetSettingsDialog;