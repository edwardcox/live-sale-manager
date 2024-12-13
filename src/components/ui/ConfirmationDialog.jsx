import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

const ConfirmationDialog = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-500">{message}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;