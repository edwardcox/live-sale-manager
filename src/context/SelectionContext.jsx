import React, { createContext, useContext, useState, useCallback } from 'react';

const SelectionContext = createContext(null);

export const SelectionProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  const toggleProduct = useCallback((productId) => {
    console.log('Toggling product:', productId);
    setSelectedProducts(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(productId)) {
        newSelection.delete(productId);
      } else {
        newSelection.add(productId);
      }
      return newSelection;
    });
  }, []);

  const selectAll = useCallback((productIds) => {
    setSelectedProducts(new Set(productIds));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedProducts(new Set());
  }, []);

  const isSelected = useCallback((productId) => {
    return selectedProducts.has(productId);
  }, [selectedProducts]);

  return (
    <SelectionContext.Provider 
      value={{
        selectedProducts,
        toggleProduct,
        selectAll,
        clearSelection,
        isSelected,
        selectionCount: selectedProducts.size
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};