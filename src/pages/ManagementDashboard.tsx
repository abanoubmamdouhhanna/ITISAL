import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AnimatedTransition from '@/components/AnimatedTransition';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Package, Store, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Calendar, RefreshCw } from 'lucide-react';
import OrderTabs from '@/components/OrderTabs';
import { OrderStatus, Store as StoreType, Order } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import * as storeService from '@/services/storeService';
import { useLanguage } from '@/context/LanguageContext';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const ManagementDashboard = () => {
  const { orders, loading, refetchData } = useStore();
  const { t } = useLanguage();
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7');
  const [stores, setStores] = useState<StoreType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orderMetrics, setOrderMetrics] = useState({
    totalOrders: 0,
    openOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    revenueChange: 0,
    ordersChange: 0
  });
  const [statusDistribution, setStatusDistribution] = useState<{name: string, value: number}[]>([]);
  const [dailyOrders, setDailyOrders] = useState<{date: string, orders: number, revenue: number}[]>([]);

  // Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          refetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetchData]);

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesData = await storeService.fetchStores();
        setStores(storesData);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };
    
    fetchStores();
  }, []);

  // Calculate metrics based on orders, store, and date range
  useEffect(() => {
    if (loading) return;

    const daysAgo = parseInt(dateRange);
    const cutoffDate = subDays(new Date(), daysAgo);
    const previousCutoffDate = subDays(new Date(), daysAgo * 2);

    // Filter orders by store and date range
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const matchesStore = selectedStore === 'all' || order.storeId === selectedStore;
      const matchesDate = orderDate >= cutoffDate;
      return matchesStore && matchesDate;
    });

    // Previous period for comparison
    const previousOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      const matchesStore = selectedStore === 'all' || order.storeId === selectedStore;
      const matchesDate = orderDate >= previousCutoffDate && orderDate < cutoffDate;
      return matchesStore && matchesDate;
    });
    
    // Count orders by status
    const statusCounts: Record<string, number> = {};
    const openStatuses: OrderStatus[] = ['Order Received', 'Store Received', 'Order Started', 'Delivery Boy Selected', 'Invoice Printed'];
    let totalRevenue = 0;
    let openOrderCount = 0;
    let deliveredOrderCount = 0;
    
    filteredOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
      totalRevenue += order.totalAmount;
      
      if (openStatuses.includes(order.status)) {
        openOrderCount++;
      } else if (order.status === 'Order Delivered') {
        deliveredOrderCount++;
      }
    });

    // Calculate previous period metrics
    const previousRevenue = previousOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const revenueChange = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;
    const ordersChange = previousOrders.length > 0
      ? ((filteredOrders.length - previousOrders.length) / previousOrders.length) * 100
      : 0;
    
    // Daily orders trend
    const dailyData: Record<string, {orders: number, revenue: number}> = {};
    for (let i = daysAgo - 1; i >= 0; i--) {
      const date = format(subDays(new Date(), i), 'MMM dd');
      dailyData[date] = { orders: 0, revenue: 0 };
    }
    
    filteredOrders.forEach(order => {
      const date = format(new Date(order.createdAt), 'MMM dd');
      if (dailyData[date]) {
        dailyData[date].orders++;
        dailyData[date].revenue += order.totalAmount;
      }
    });
    
    const dailyOrdersData = Object.entries(dailyData).map(([date, data]) => ({
      date,
      orders: data.orders,
      revenue: data.revenue
    }));
    
    setOrderMetrics({
      totalOrders: filteredOrders.length,
      openOrders: openOrderCount,
      deliveredOrders: deliveredOrderCount,
      totalRevenue,
      avgOrderValue: filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0,
      revenueChange,
      ordersChange
    });
    
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value
    }));
    
    setStatusDistribution(statusData);
    setDailyOrders(dailyOrdersData);
  }, [orders, selectedStore, dateRange, loading]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <AnimatedTransition location="management-dashboard">
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Header title={t('management.title')} showBackButton={true} />
        
        <main className="flex-1 container mx-auto py-4 sm:py-6 px-2 sm:px-4">
          {/* Header Section */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {t('management.title')}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time analytics and order management
                </p>
              </div>
              
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
                className="self-start sm:self-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Last 24 hours</SelectItem>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStore} onValueChange={setSelectedStore}>
                <SelectTrigger className="w-full sm:w-48">
                  <Store className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('management.filterStore')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('management.allStores')}</SelectItem>
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>{store.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="relative overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('management.totalOrders')}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold">{orderMetrics.totalOrders}</h3>
                      {orderMetrics.ordersChange !== 0 && (
                        <Badge variant={orderMetrics.ordersChange > 0 ? "default" : "destructive"} className="text-xs">
                          {orderMetrics.ordersChange > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(orderMetrics.ordersChange).toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-l-4 border-l-amber-500 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('management.openOrders')}</p>
                    <h3 className="text-3xl font-bold">{orderMetrics.openOrders}</h3>
                    <p className="text-xs text-muted-foreground">
                      {orderMetrics.totalOrders > 0 ? Math.round((orderMetrics.openOrders / orderMetrics.totalOrders) * 100) : 0}% of total
                    </p>
                  </div>
                  <div className="bg-amber-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-l-4 border-l-green-500 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('management.deliveredOrders')}</p>
                    <h3 className="text-3xl font-bold">{orderMetrics.deliveredOrders}</h3>
                    <p className="text-xs text-muted-foreground">
                      {orderMetrics.totalOrders > 0 ? Math.round((orderMetrics.deliveredOrders / orderMetrics.totalOrders) * 100) : 0}% completion
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{t('management.totalRevenue')}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold">${orderMetrics.totalRevenue.toFixed(2)}</h3>
                      {orderMetrics.revenueChange !== 0 && (
                        <Badge variant={orderMetrics.revenueChange > 0 ? "default" : "destructive"} className="text-xs">
                          {orderMetrics.revenueChange > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {Math.abs(orderMetrics.revenueChange).toFixed(1)}%
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Avg: ${orderMetrics.avgOrderValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Enhanced Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Order Trend</CardTitle>
                <CardDescription>Daily orders and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyOrders}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="orders" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        name="Orders"
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        name="Revenue ($)"
                        dot={{ fill: '#22c55e' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardHeader>
                <CardTitle className="text-lg">Order Status Distribution</CardTitle>
                <CardDescription>Breakdown by order status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} orders`, 'Count']}
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Order Management Section */}
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle>{t('management.orderManagement')}</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTabs />
            </CardContent>
          </Card>
        </main>
      </div>
    </AnimatedTransition>
  );
};

export default ManagementDashboard;
