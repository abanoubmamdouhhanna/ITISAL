// import React, { useState, useEffect } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Plus, Minus, ShoppingCart, Pizza, Coffee, Utensils, Sandwich, Edit, MessageSquare } from 'lucide-react';
// import { Product, ProductCategory, OrderItem } from '@/lib/types';
// import { toast } from 'sonner';
// import { motion } from 'framer-motion';
// import { fetchProductCategories, fetchProducts, getProductsByCategory } from '@/services/productService';
// import ItemEditor from './ItemEditor';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// interface ProductCatalogProps {
//   onAddToCart: (item: OrderItem) => void;
//   cart: OrderItem[];
//   onUpdateItem: (itemId: string, quantity: number) => void;
//   onRemoveItem: (itemId: string) => void;
//   onCheckout: () => void;
// }

// const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
//   onAddToCart, 
//   cart,
//   onUpdateItem,
//   onRemoveItem,
//   onCheckout
// }) => {
//   const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
//   const [categoryProducts, setCategoryProducts] = useState<{[key: string]: Product[]}>({});
//   const [activeCategory, setActiveCategory] = useState<string>('');
//   const [itemNotes, setItemNotes] = useState<string>('');
//   const [loading, setLoading] = useState(true);
//   const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const categories = await fetchProductCategories();
//         setProductCategories(categories);
        
//         if (categories.length > 0) {
//           setActiveCategory(categories[0].id);
          
//           const products = await getProductsByCategory(categories[0].id);
//           setCategoryProducts(prev => ({
//             ...prev,
//             [categories[0].id]: products
//           }));
//         }
//       } catch (error) {
//         console.error('Error loading product categories:', error);
//         toast.error('Failed to load product categories');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadData();
//   }, []);
  
//   useEffect(() => {
//     if (activeCategory && !categoryProducts[activeCategory]) {
//       const loadCategoryProducts = async () => {
//         try {
//           const products = await getProductsByCategory(activeCategory);
//           setCategoryProducts(prev => ({
//             ...prev,
//             [activeCategory]: products
//           }));
//         } catch (error) {
//           console.error(`Error loading products for category ${activeCategory}:`, error);
//           toast.error('Failed to load products');
//         }
//       };
      
//       loadCategoryProducts();
//     }
//   }, [activeCategory, categoryProducts]);
  
//   const getCategoryIcon = (iconName: string) => {
//     switch (iconName) {
//       case 'pizza':
//         return <Pizza className="h-5 w-5" />;
//       case 'coffee':
//         return <Coffee className="h-5 w-5" />;
//       case 'utensils':
//         return <Utensils className="h-5 w-5" />;
//       case 'sandwich':
//         return <Sandwich className="h-5 w-5" />;
//       default:
//         return <Pizza className="h-5 w-5" />;
//     }
//   };
  
//   const handleAddToCart = (product: Product) => {
//     const existingItem = cart.find(item => item.productId === product.id);
    
//     if (existingItem) {
//       onUpdateItem(existingItem.id, existingItem.quantity + 1);
//       toast.success(`Added another ${product.name} to cart`);
//       return;
//     }
    
//     const newItem: OrderItem = {
//       id: `item-${Date.now()}`,
//       productId: product.id,
//       productName: product.name,
//       quantity: 1,
//       price: product.price,
//       notes: itemNotes,
//       discount: 0,
//     };
    
//     onAddToCart(newItem);
//     setItemNotes('');
//     toast.success(`${product.name} added to cart`);
//   };
  
//   const handleUpdateItemDetails = (updatedItem: OrderItem) => {
//     const itemIndex = cart.findIndex(item => item.id === updatedItem.id);
    
//     if (itemIndex !== -1) {
//       const newCart = [...cart];
//       newCart[itemIndex] = updatedItem;
      
//       onUpdateItem(updatedItem.id, updatedItem.quantity);
      
//       setOpenPopoverId(null);
//     }
//   };
  
//   const getCartSubtotal = () => {
//     return cart.reduce((total, item) => {
//       const itemPrice = item.price * item.quantity;
//       const discount = item.discount ? (itemPrice * (item.discount / 100)) : 0;
//       return total + (itemPrice - discount);
//     }, 0);
//   };
  
//   const getVAT = () => {
//     return getCartSubtotal() * 0.14;
//   };
  
//   const getProductsForCurrentCategory = (): Product[] => {
//     return categoryProducts[activeCategory] || [];
//   };
  
//   if (loading) {
//     return <div className="flex justify-center items-center h-64">Loading products...</div>;
//   }
  
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
//       <div className="lg:col-span-2">
//         <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
//           <div className="mb-6">
//             <TabsList className="bg-secondary/80 grid grid-cols-4 h-auto p-1 rounded-full">
//               {productCategories.map((category) => (
//                 console.log({})
//                 <TabsTrigger
//                   key={category.id}
//                   value={category.id}
//                   className="flex items-center gap-2 rounded-full py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
//                 >
//                   {getCategoryIcon(category.icon)}
//                   <span>{category.name}</span>
//                 </TabsTrigger>
//               ))}
//             </TabsList>
//           </div>
          
//           <div className="flex-1 overflow-auto">
//             {productCategories.map((category) => (
//               <TabsContent
//                 key={category.id}
//                 value={category.id}
//                 className="h-full mt-0 data-[state=active]:animate-fade-in"
//               >
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {(categoryProducts[category.id] || []).map((product, index) => (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.05, duration: 0.3 }}
//                     >
//                       <Card className="flex flex-col p-4 h-full card-shadow hover:shadow-md transition-all duration-200">
//                         <div className="flex flex-col h-full">
//                           <div className="flex justify-between mb-2">
//                             <h3 className="font-medium">{product.name}</h3>
//                             <div className="font-medium text-primary">${product.price.toFixed(2)}</div>
//                           </div>
//                           <p className="text-gray-500 text-sm mb-4">{product.description}</p>
//                           <div className="mt-auto">
//                             <Button
//                               onClick={() => handleAddToCart(product)}
//                               className="w-full"
//                               size="sm"
//                             >
//                               Add to Order
//                             </Button>
//                           </div>
//                         </div>
//                       </Card>
//                     </motion.div>
//                   ))}
//                 </div>
//               </TabsContent>
//             ))}
//           </div>
//         </Tabs>
//       </div>
      
//       <div className="bg-secondary/20 rounded-lg p-4 flex flex-col">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="font-semibold text-lg flex items-center gap-2">
//             <ShoppingCart className="h-5 w-5" />
//             <span>Current Order</span>
//           </h3>
//           <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
//             {cart.reduce((total, item) => total + item.quantity, 0)} items
//           </span>
//         </div>
        
//         <div className="flex-1 overflow-auto mb-4">
//           {cart.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-32 text-gray-400">
//               <ShoppingCart className="h-8 w-8 mb-2 opacity-30" />
//               <p>Your cart is empty</p>
//               <p className="text-sm">Add items to get started</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {cart.map((item) => (
//                 <Card key={item.id} className="p-3 bg-white">
//                   <div className="flex justify-between mb-1">
//                     <h4 className="font-medium text-sm">{item.productName}</h4>
//                     <span className="font-medium text-primary text-sm">
//                       ${((item.price * item.quantity) * (1 - (item.discount || 0) / 100)).toFixed(2)}
//                     </span>
//                   </div>
                  
//                   {item.notes && (
//                     <div className="text-xs text-gray-500 mb-2 bg-gray-50 p-1.5 rounded flex items-start gap-1">
//                       <MessageSquare className="h-3 w-3 mt-0.5 text-gray-400" />
//                       <span className="italic">{item.notes}</span>
//                     </div>
//                   )}
                  
//                   {item.discount > 0 && (
//                     <p className="text-xs text-green-600 mb-2">
//                       {item.discount}% discount applied
//                     </p>
//                   )}
                  
//                   <div className="flex items-center justify-between mt-2">
//                     <div className="text-xs text-gray-500">
//                       ${item.price.toFixed(2)} each
//                     </div>
//                     <div className="flex items-center">
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-6 w-6 rounded-full"
//                         onClick={() => {
//                           if (item.quantity > 1) {
//                             onUpdateItem(item.id, item.quantity - 1);
//                           } else {
//                             onRemoveItem(item.id);
//                           }
//                         }}
//                       >
//                         <Minus className="h-3 w-3" />
//                         <span className="sr-only">Decrease</span>
//                       </Button>
                      
//                       <span className="w-8 text-center text-sm">
//                         {item.quantity}
//                       </span>
                      
//                       <Button
//                         variant="outline"
//                         size="icon"
//                         className="h-6 w-6 rounded-full"
//                         onClick={() => onUpdateItem(item.id, item.quantity + 1)}
//                       >
//                         <Plus className="h-3 w-3" />
//                         <span className="sr-only">Increase</span>
//                       </Button>
                      
//                       <Popover open={openPopoverId === item.id} onOpenChange={(isOpen) => {
//                         setOpenPopoverId(isOpen ? item.id : null);
//                       }}>
//                         <PopoverTrigger asChild>
//                           <Button
//                             variant="outline"
//                             size="icon"
//                             className="h-6 w-6 rounded-full ml-1"
//                           >
//                             <Edit className="h-3 w-3" />
//                             <span className="sr-only">Edit</span>
//                           </Button>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-80 p-3">
//                           <div className="font-medium text-sm mb-2">Edit Item</div>
//                           <ItemEditor 
//                             item={item} 
//                             onUpdate={handleUpdateItemDetails}
//                             onClose={() => setOpenPopoverId(null)}
//                           />
//                         </PopoverContent>
//                       </Popover>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
        
//         <div className="space-y-4">
//           <div className="space-y-1.5">
//             <Label htmlFor="notes" className="text-sm">
//               Special Instructions
//             </Label>
//             <textarea
//               id="notes"
//               placeholder="Add notes for next item..."
//               value={itemNotes}
//               onChange={(e) => setItemNotes(e.target.value)}
//               className="w-full p-2 border rounded-md text-sm h-20 resize-none"
//             />
//           </div>
          
//           <div className="pt-3 border-t">
//             <div className="flex justify-between mb-1">
//               <span className="font-medium text-sm">Subtotal</span>
//               <span className="font-medium text-sm">${getCartSubtotal().toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between mb-2">
//               <span className="font-medium text-sm text-gray-600">VAT (14%)</span>
//               <span className="font-medium text-sm text-gray-600">${getVAT().toFixed(2)}</span>
//             </div>
//             <Button
//               onClick={onCheckout}
//               disabled={cart.length === 0}
//               className="w-full"
//               size="lg"
//             >
//               Proceed to Checkout
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCatalog;
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Minus, ShoppingCart, Pizza, Coffee, Utensils, Sandwich, Edit, MessageSquare } from 'lucide-react';
import { Product, ProductCategory, OrderItem } from '@/lib/types';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { fetchProductCategories, fetchProducts, getProductsByCategory } from '@/services/productService';
import ItemEditor from './ItemEditor';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProductCatalogProps {
  onAddToCart: (item: OrderItem) => void;
  cart: OrderItem[];
  onUpdateItem: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  onAddToCart, 
  cart,
  onUpdateItem,
  onRemoveItem,
  onCheckout
}) => {
  const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<{[key: string]: Product[]}>({});
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [itemNotes, setItemNotes] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const categories = await fetchProductCategories();
        setProductCategories(categories);
        
        if (categories.length > 0) {
          setActiveCategory(categories[0].id);
          
          const products = await getProductsByCategory(categories[0].id);
          setCategoryProducts(prev => ({
            ...prev,
            [categories[0].id]: products
          }));
        }
      } catch (error) {
        console.error('Error loading product categories:', error);
        toast.error('Failed to load product categories');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  // Add this useEffect to debug product loading
useEffect(() => {
  console.log('Product Categories:', productCategories);
  console.log('Category Products:', categoryProducts);
  console.log('Active Category:', activeCategory);
  console.log('Cart Items:', cart);
}, [productCategories, categoryProducts, activeCategory, cart]);
  
  useEffect(() => {
    if (activeCategory && !categoryProducts[activeCategory]) {
      const loadCategoryProducts = async () => {
        try {
          const products = await getProductsByCategory(activeCategory);
          setCategoryProducts(prev => ({
            ...prev,
            [activeCategory]: products
          }));
        } catch (error) {
          console.error(`Error loading products for category ${activeCategory}:`, error);
          toast.error('Failed to load products');
        }
      };
      
      loadCategoryProducts();
    }
  }, [activeCategory, categoryProducts]);
  
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'pizza':
        return <Pizza className="h-5 w-5" />;
      case 'coffee':
        return <Coffee className="h-5 w-5" />;
      case 'utensils':
        return <Utensils className="h-5 w-5" />;
      case 'sandwich':
        return <Sandwich className="h-5 w-5" />;
      default:
        return <Pizza className="h-5 w-5" />;
    }
  };
  
  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      onUpdateItem(existingItem.id, existingItem.quantity + 1);
      toast.success(`Added another ${product.name} to cart`);
      return;
    }
    
    const newItem: OrderItem = {
      id: `item-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      quantity: 1,
      price: product.price,
      notes: itemNotes,
      discount: 0,
    };
    
    onAddToCart(newItem);
    setItemNotes('');
    toast.success(`${product.name} added to cart`);
  };
  
  const handleUpdateItemDetails = (updatedItem: OrderItem) => {
    const itemIndex = cart.findIndex(item => item.id === updatedItem.id);
    
    if (itemIndex !== -1) {
      const newCart = [...cart];
      newCart[itemIndex] = updatedItem;
      
      onUpdateItem(updatedItem.id, updatedItem.quantity);
      
      setOpenPopoverId(null);
    }
  };
  
  const getCartSubtotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const discount = item.discount ? (itemPrice * (item.discount / 100)) : 0;
      return total + (itemPrice - discount);
    }, 0);
  };
  
  const getVAT = () => {
    return getCartSubtotal() * 0.14;
  };
  
  const getProductsForCurrentCategory = (): Product[] => {
    return categoryProducts[activeCategory] || [];
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading products...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      <div className="lg:col-span-2">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
          <div className="mb-6">
            <TabsList className="bg-secondary/80 grid grid-cols-4 h-auto p-1 rounded-full">
              {productCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 rounded-full py-2.5 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-200"
                >
                  {getCategoryIcon(category.icon)}
                  <span>{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-auto">
            {productCategories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="h-full mt-0 data-[state=active]:animate-fade-in"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(categoryProducts[category.id] || []).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Card className="flex flex-col p-4 h-full card-shadow hover:shadow-md transition-all duration-200">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="font-medium text-primary">${product.price.toFixed(2)}</div>
                          </div>
                          <p className="text-gray-500 text-sm mb-4">{product.description}</p>
                          <div className="mt-auto">
                            <Button
                              onClick={() => handleAddToCart(product)}
                              className="w-full"
                              size="sm"
                            >
                              Add to Order
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
      
      <div className="bg-secondary/20 rounded-lg p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Current Order</span>
          </h3>
          <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
            {cart.reduce((total, item) => total + item.quantity, 0)} items
          </span>
        </div>
        
        <div className="flex-1 overflow-auto mb-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-400">
              <ShoppingCart className="h-8 w-8 mb-2 opacity-30" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <Card key={item.id} className="p-3 bg-white">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium text-sm">{item.productName}</h4>
                    <span className="font-medium text-primary text-sm">
                      ${((item.price * item.quantity) * (1 - (item.discount || 0) / 100)).toFixed(2)}
                    </span>
                  </div>
                  
                  {item.notes && (
                    <div className="text-xs text-gray-500 mb-2 bg-gray-50 p-1.5 rounded flex items-start gap-1">
                      <MessageSquare className="h-3 w-3 mt-0.5 text-gray-400" />
                      <span className="italic">{item.notes}</span>
                    </div>
                  )}
                  
                  {item.discount > 0 && (
                    <p className="text-xs text-green-600 mb-2">
                      {item.discount}% discount applied
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">
                      ${item.price.toFixed(2)} each
                    </div>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateItem(item.id, item.quantity - 1);
                          } else {
                            onRemoveItem(item.id);
                          }
                        }}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => onUpdateItem(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase</span>
                      </Button>
                      
                      <Popover open={openPopoverId === item.id} onOpenChange={(isOpen) => {
                        setOpenPopoverId(isOpen ? item.id : null);
                      }}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-6 w-6 rounded-full ml-1"
                          >
                            <Edit className="h-3 w-3" />
                            <span className="sr-only">Edit</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-3">
                          <div className="font-medium text-sm mb-2">Edit Item</div>
                          <ItemEditor 
                            item={item} 
                            onUpdate={handleUpdateItemDetails}
                            onClose={() => setOpenPopoverId(null)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-sm">
              Special Instructions
            </Label>
            <textarea
              id="notes"
              placeholder="Add notes for next item..."
              value={itemNotes}
              onChange={(e) => setItemNotes(e.target.value)}
              className="w-full p-2 border rounded-md text-sm h-20 resize-none"
            />
          </div>
          
          <div className="pt-3 border-t">
            <div className="flex justify-between mb-1">
              <span className="font-medium text-sm">Subtotal</span>
              <span className="font-medium text-sm">${getCartSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-sm text-gray-600">VAT (14%)</span>
              <span className="font-medium text-sm text-gray-600">${getVAT().toFixed(2)}</span>
            </div>
            <Button
              onClick={onCheckout}
              disabled={cart.length === 0}
              className="w-full"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;