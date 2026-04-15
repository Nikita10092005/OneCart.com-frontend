import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'recently_viewed_products';
const MAX_ITEMS = 10;

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recently viewed:', e);
      }
    }
  }, []);

  const addToRecentlyViewed = useCallback((product) => {
    if (!product || !product._id) return;
    
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p._id !== product._id);
      const updated = [{
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        viewedAt: new Date().toISOString()
      }, ...filtered].slice(0, MAX_ITEMS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentlyViewed([]);
  }, []);

  const removeFromRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed(prev => {
      const updated = prev.filter(p => p._id !== productId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recentlyViewed, addToRecentlyViewed, clearRecentlyViewed, removeFromRecentlyViewed };
}
