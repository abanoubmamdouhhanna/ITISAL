
import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronUp } from 'lucide-react';
import { fetchProducts } from '@/services/productService';
import { useLanguage } from '@/context/LanguageContext';

interface CustomerBestItemsProps {
  customerId: string;
  onAddToCart: (product: Product) => void;
}

const CustomerBestItems: React.FC<CustomerBestItemsProps> = ({
  customerId,
  onAddToCart
}) => {
  const { t } = useLanguage();
  const { orders } = useStore();
  const [bestItems, setBestItems] = useState<{product: Product, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBestItems = async () => {
      try {
        setLoading(true);
        
        // Get customer's orders
        const customerOrders = orders.filter(order => order.customerId === customerId);
        
        // Count item frequency
        const productCounts: Record<string, number> = {};
        
        customerOrders.forEach(order => {
          order.items.forEach(item => {
            if (productCounts[item.productId]) {
              productCounts[item.productId] += item.quantity;
            } else {
              productCounts[item.productId] = item.quantity;
            }
          });
        });
        
        // Get product details for the counts
        const products = await fetchProducts();
        
        const bestItemsWithDetails = Object.entries(productCounts)
          .map(([productId, count]) => {
            const product = products.find(p => p.id === productId);
            return product ? { product, count } : null;
          })
          .filter(item => item !== null) as {product: Product, count: number}[];
        
        // Sort by count (highest first)
        bestItemsWithDetails.sort((a, b) => b.count - a.count);
        
        // Take top items
        setBestItems(bestItemsWithDetails.slice(0, 6));
      } catch (error) {
        console.error('Error loading best items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadBestItems();
  }, [customerId, orders]);

  if (loading) {
    return <div className="py-8 text-center">{t('app.loading')}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">{t('bestItems.title')}</h2>
      
      {bestItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('bestItems.noFavorites')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bestItems.map(({product, count}) => (
            <Card key={product.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{product.name}</h3>
                <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full flex items-center">
                  <ChevronUp className="h-3 w-3 mr-1" />
                  {t('bestItems.ordered', { count, times: count === 1 ? t('bestItems.time') : t('bestItems.times') })}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-medium text-primary">${product.price.toFixed(2)}</span>
                <Button
                  onClick={() => onAddToCart(product)}
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  {t('bestItems.addToCart')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBestItems;
