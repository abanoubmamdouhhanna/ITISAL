
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import ProductCatalog from '@/components/ProductCatalog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Customer, Address, Store, OrderItem, Order } from '@/lib/types';
import AnimatedTransition from '@/components/AnimatedTransition';
import { DollarSign, CreditCard, ShoppingBag, History, Star, MessageSquare, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useStore } from '@/context/StoreContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LastCustomerOrders from '@/components/LastCustomerOrders';
import CustomerBestItems from '@/components/CustomerBestItems';
import CustomerComplaints from '@/components/CustomerComplaints';

const PosScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder, orders } = useStore();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'visa' | 'credit'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("pos");
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [deliveryFee, setDeliveryFee] = useState(10); // Default delivery fee
  
  useEffect(() => {
    // Get customer and store information from location state
    if (location.state) {
      const { customer: locationCustomer, address: locationAddress, store: locationStore, editOrder } = location.state;
      
      if (locationCustomer && locationAddress && locationStore) {
        setCustomer(locationCustomer);
        setAddress(locationAddress);
        setStore(locationStore);
        
        // If we're editing an existing order
        if (editOrder) {
          const orderToEdit = orders.find(o => o.id === editOrder);
          if (orderToEdit) {
            setEditingOrderId(orderToEdit.id);
            setCart(orderToEdit.items);
            // Set delivery fee if it exists in the order
            if (orderToEdit.deliveryFee) {
              setDeliveryFee(orderToEdit.deliveryFee);
            }
            toast.info(`Editing order #${orderToEdit.id.substring(orderToEdit.id.length - 4)}`);
          }
        }
      } else {
        // If no customer or store info, redirect back to new order page
        navigate('/new-order');
        toast.error('Customer or store information missing');
      }
    } else {
      // If no location state, redirect back to new order page
      navigate('/new-order');
      toast.error('Please select a customer first');
    }
  }, [location, navigate, orders]);
  
  const handleAddToCart = (item: OrderItem) => {
    setCart([...cart, item]);
  };
  
  const handleUpdateItem = (itemId: string, quantity: number) => {
    // Preserve all item properties when updating quantity
    setCart(
      cart.map((item) => 
        item.id === itemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const handleRemoveItem = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
    toast.info('Item removed from cart');
  };
  
  const handleCheckout = () => {
    setShowPaymentDialog(true);
  };
  
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      // Consider discount if present
      const itemPrice = item.price * item.quantity;
      const discount = item.discount ? (itemPrice * (item.discount / 100)) : 0;
      return total + (itemPrice - discount);
    }, 0);
  };
  
  const getVAT = () => {
    // Calculate 14% VAT on subtotal
    return getSubtotal() * 0.14;
  };
  
  const getTotal = () => {
    // Total = Subtotal + VAT + Delivery Fee
    return getSubtotal() + getVAT() + deliveryFee;
  };
  
  const handleCompleteOrder = async () => {
    if (!customer || !address || !store) {
      toast.error('Customer or store information missing');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Please add items to the order');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Determine if we're updating an existing order or creating a new one
      if (editingOrderId) {
        // Update existing order - keep original ID and creation time
        const existingOrder = orders.find(o => o.id === editingOrderId);
        if (!existingOrder) {
          throw new Error('Order not found');
        }
        
        const updatedOrder: Order = {
          ...existingOrder,
          items: cart,
          totalAmount: getTotal() - deliveryFee - getVAT(),
          vatAmount: getVAT(),
          deliveryFee: deliveryFee,
          paymentMethod: paymentMethod,
          updatedAt: new Date().toISOString(),
        };
        
        // Update the order in our global store
        await addOrder(updatedOrder);
        
        toast.success('Order updated successfully');
      } else {
        // Create new order
        const newOrder: Order = {
          id: `order${Date.now()}`,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phoneNumber,
          addressId: address.id,
          deliveryAddress: `${address.street}, ${address.city}, ${address.zipCode}`,
          storeId: store.id,
          storeName: store.name,
          items: cart,
          totalAmount: getSubtotal(),
          vatAmount: getVAT(),
          deliveryFee: deliveryFee,
          status: 'Order Received',
          paymentMethod: paymentMethod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Add the order to our global store
        await addOrder(newOrder);
        
        toast.success('Order created successfully');
      }
      
      setShowPaymentDialog(false);
      // Navigate back to the dashboard
      navigate('/');
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const paymentMethods = [
    { value: 'cash', label: 'Cash on Delivery', icon: <DollarSign className="h-4 w-4" /> },
    { value: 'visa', label: 'Credit/Debit Card', icon: <CreditCard className="h-4 w-4" /> },
    { value: 'credit', label: 'Credit Account', icon: <CreditCard className="h-4 w-4" /> },
  ];
  
  return (
    <AnimatedTransition location="pos-screen">
      <div className="flex flex-col min-h-screen">
        <Header 
          title={`${editingOrderId ? 'Edit' : 'New'} Order - ${store?.name || 'Loading...'}`}
          showBackButton={true}
        />
        
        <main className="flex-1 container mx-auto py-6 px-4">
          {customer && (
            <div className="mb-4 p-2 sm:p-3 bg-secondary/30 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-gray-500">Customer:</span>
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-gray-500">({customer.phoneNumber})</span>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-gray-500">Delivery Address:</span>
                  <span className="font-medium">
                    {address?.street}, {address?.city}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4 h-auto">
              <TabsTrigger value="pos" className="flex flex-col sm:flex-row items-center gap-1 py-2 text-xs sm:text-sm">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline">Order</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex flex-col sm:flex-row items-center gap-1 py-2 text-xs sm:text-sm">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Last Orders</span>
              </TabsTrigger>
              <TabsTrigger value="best" className="flex flex-col sm:flex-row items-center gap-1 py-2 text-xs sm:text-sm">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Best Items</span>
              </TabsTrigger>
              <TabsTrigger value="complaints" className="flex flex-col sm:flex-row items-center gap-1 py-2 text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Complaints</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pos" className="mt-0">
              <ProductCatalog 
                onAddToCart={handleAddToCart} 
                cart={cart}
                onUpdateItem={handleUpdateItem}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
              />
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              {customer && (
                <LastCustomerOrders 
                  customerId={customer.id} 
                  onEditOrder={(orderId) => {
                    setEditingOrderId(orderId);
                    const orderToEdit = orders.find(o => o.id === orderId);
                    if (orderToEdit) {
                      setCart(orderToEdit.items);
                      if (orderToEdit.deliveryFee) {
                        setDeliveryFee(orderToEdit.deliveryFee);
                      }
                      setActiveTab("pos");
                      toast.info(`Editing order #${orderId.substring(orderId.length - 4)}`);
                    }
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="best" className="mt-0">
              {customer && (
                <CustomerBestItems
                  customerId={customer.id}
                  onAddToCart={(product) => {
                    const newItem: OrderItem = {
                      id: `item-${Date.now()}`,
                      productId: product.id,
                      productName: product.name,
                      quantity: 1,
                      price: product.price,
                      notes: '',
                      discount: 0,
                    };
                    handleAddToCart(newItem);
                    setActiveTab("pos");
                    toast.success(`${product.name} added to cart`);
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="complaints" className="mt-0">
              {customer && (
                <CustomerComplaints
                  customerId={customer.id}
                />
              )}
            </TabsContent>
          </Tabs>
        </main>
        
        {/* Payment Method Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Payment Method</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="mb-4">
                <Label htmlFor="deliveryFee" className="text-sm mb-1 block">
                  Delivery Fee
                </Label>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-gray-500" />
                  <Input
                    id="deliveryFee"
                    type="number"
                    min="0"
                    step="1"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'cash' | 'visa' | 'credit')}
                className="space-y-3"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.value}
                    className={`flex items-center space-x-2 p-3 border rounded-md cursor-pointer transition-all ${
                      paymentMethod === method.value
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod(method.value as 'cash' | 'visa' | 'credit')}
                  >
                    <RadioGroupItem value={method.value} id={method.value} />
                    <div className="flex items-center gap-2">
                      {method.icon}
                      <Label htmlFor={method.value} className="cursor-pointer font-normal">
                        {method.label}
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">VAT (14%):</span>
                  <span>${getVAT().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee:</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteOrder} disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : editingOrderId ? 'Update Order' : 'Complete Order'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedTransition>
  );
};

export default PosScreen;
