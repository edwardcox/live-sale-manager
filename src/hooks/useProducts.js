import { useState, useEffect, useCallback } from 'react';
import { fetchShopifyProducts } from '../lib/shopify';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProducts = await fetchShopifyProducts();
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refreshProducts = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refreshProducts
  };
};

export default useProducts;