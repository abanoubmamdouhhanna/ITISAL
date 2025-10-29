import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Customer, Address, Order, OrderItem, Store } from '@/lib/types';
import { toast } from 'sonner';
import * as customerService from '@/services/customerService';
import * as orderService from '@/services/orderService';
import * as storeService from '@/services/storeService';
import * as setupService from '@/services/setupService';
import { 
  StoreSetup, 
  RegionSetup, 
  StoreRegionLink, 
  ItemGroup, 
  Item, 
  SystemUser, 
  UserPermission,
  Brand
} from '@/lib/setup-types';

interface AddCustomerParams {
  phoneNumber: string;
  name: string;
  address: string;
  paymentMethods: { cash: boolean; visa: boolean; credit: boolean };
  regionId?: string;
}

interface StoreContextType {
  customers: Customer[];
  orders: Order[];
  stores: Store[];
  storeSetups: StoreSetup[];
  brands: Brand[];
  regions: RegionSetup[];
  storeRegionLinks: StoreRegionLink[];
  itemGroups: ItemGroup[];
  items: Item[];
  systemUsers: SystemUser[];
  userPermissions: UserPermission[];
  loading: boolean;
  addCustomer: (customer: AddCustomerParams) => Promise<Customer>;
  addOrder: (order: Order) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  refetchData: () => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt'>) => Promise<Brand>;
  updateBrand: (brand: Brand) => Promise<Brand>;
  deleteBrand: (id: string) => Promise<void>;
  addStoreSetup: (store: Omit<StoreSetup, 'id' | 'createdAt'>) => Promise<StoreSetup>;
  updateStoreSetup: (store: StoreSetup) => Promise<StoreSetup>;
  deleteStoreSetup: (id: string) => Promise<void>;
  addRegion: (region: Omit<RegionSetup, 'id' | 'createdAt'>) => Promise<RegionSetup>;
  updateRegion: (region: RegionSetup) => Promise<RegionSetup>;
  deleteRegion: (id: string) => Promise<void>;
  linkStoreToRegion: (storeId: string, regionId: string) => Promise<StoreRegionLink>;
  unlinkStoreFromRegion: (linkId: string) => Promise<void>;
  addItemGroup: (group: Omit<ItemGroup, 'id' | 'createdAt'>) => Promise<ItemGroup>;
  updateItemGroup: (group: ItemGroup) => Promise<ItemGroup>;
  deleteItemGroup: (id: string) => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<Item>;
  updateItem: (item: Item) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
  addSystemUser: (user: Omit<SystemUser, 'id' | 'createdAt'>) => Promise<SystemUser>;
  updateSystemUser: (user: SystemUser) => Promise<SystemUser>;
  deleteSystemUser: (id: string) => Promise<void>;
  updateUserPermissions: (permissions: Omit<UserPermission, 'createdAt'>) => Promise<UserPermission>;
  checkPermission: (permission: keyof Omit<UserPermission, 'id' | 'userId' | 'createdAt'>, userId: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [storeSetups, setStoreSetups] = useState<StoreSetup[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [regions, setRegions] = useState<RegionSetup[]>([]);
  const [storeRegionLinks, setStoreRegionLinks] = useState<StoreRegionLink[]>([]);
  const [itemGroups, setItemGroups] = useState<ItemGroup[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        customersData, 
        ordersData, 
        storesData,
        storeSetupsData,
        brandsData,
        regionsData,
        storeRegionLinksData,
        itemGroupsData,
        itemsData,
        systemUsersData,
        userPermissionsData
      ] = await Promise.all([
        customerService.fetchCustomers(),
        orderService.fetchOrders(),
        storeService.fetchStores(),
        setupService.fetchStoreSetups(),
        setupService.fetchBrands(),
        setupService.fetchRegions(),
        setupService.fetchStoreRegionLinks(),
        setupService.fetchItemGroups(),
        setupService.fetchItems(),
        setupService.fetchSystemUsers(),
        setupService.fetchUserPermissions()
      ]);
      
      setCustomers(customersData);
      setOrders(ordersData);
      setStores(storesData);
      setStoreSetups(storeSetupsData);
      setBrands(brandsData);
      setRegions(regionsData);
      setStoreRegionLinks(storeRegionLinksData);
      setItemGroups(itemGroupsData);
      setItems(itemsData);
      setSystemUsers(systemUsersData);
      setUserPermissions(userPermissionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addCustomer = async ({ phoneNumber, name, address, paymentMethods, regionId }: AddCustomerParams) => {
    try {
      const newCustomer = await customerService.addCustomer({
        phoneNumber,
        name,
        address,
        paymentMethods,
        regionId
      });
      setCustomers((prev) => [...prev, newCustomer]);
      toast.success(`Customer ${newCustomer.name} added successfully`);
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
      throw error;
    }
  };

  const addOrder = async (order: Order) => {
    try {
      const existingOrderIndex = orders.findIndex(o => o.id === order.id);
      const isUpdate = existingOrderIndex !== -1;
      
      const savedOrder = await orderService.addOrder(order);
      
      if (isUpdate) {
        setOrders((prev) => 
          prev.map((o) => o.id === savedOrder.id ? savedOrder : o)
        );
        toast.success(`Order #${savedOrder.id.substring(savedOrder.id.length - 4)} updated successfully`);
      } else {
        setOrders((prev) => [savedOrder, ...prev]);
        toast.success(`Order #${savedOrder.id.substring(savedOrder.id.length - 4)} created successfully`);
      }
      
      return savedOrder;
    } catch (error) {
      console.error('Error adding/updating order:', error);
      toast.error('Failed to save order');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      setOrders((prev) => 
        prev.map((order) => 
          order.id === orderId 
            ? { ...order, status, updatedAt: new Date().toISOString() } 
            : order
        )
      );
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
      throw error;
    }
  };

  const addBrand = async (brand: Omit<Brand, 'id' | 'createdAt'>) => {
    try {
      const newBrand = await setupService.addBrand(brand);
      setBrands((prev) => [...prev, newBrand]);
      toast.success(`Brand ${newBrand.brandEngName} added successfully`);
      return newBrand;
    } catch (error) {
      console.error('Error adding brand:', error);
      toast.error('Failed to add brand');
      throw error;
    }
  };

  const updateBrand = async (brand: Brand) => {
    try {
      const updatedBrand = await setupService.updateBrand(brand);
      setBrands((prev) => 
        prev.map((b) => b.id === updatedBrand.id ? updatedBrand : b)
      );
      toast.success(`Brand ${updatedBrand.brandEngName} updated successfully`);
      return updatedBrand;
    } catch (error) {
      console.error('Error updating brand:', error);
      toast.error('Failed to update brand');
      throw error;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await setupService.deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      toast.success('Brand deleted successfully');
    } catch (error) {
      console.error('Error deleting brand:', error);
      toast.error('Failed to delete brand');
      throw error;
    }
  };

  const addStoreSetup = async (store: Omit<StoreSetup, 'id' | 'createdAt'>) => {
    try {
      const newStore = await setupService.addStoreSetup(store);
      setStoreSetups((prev) => [...prev, newStore]);
      toast.success(`Store ${newStore.storeEngName} added successfully`);
      return newStore;
    } catch (error) {
      console.error('Error adding store:', error);
      toast.error('Failed to add store');
      throw error;
    }
  };

  const updateStoreSetup = async (store: StoreSetup) => {
    try {
      const updatedStore = await setupService.updateStoreSetup(store);
      setStoreSetups((prev) => 
        prev.map((s) => s.id === updatedStore.id ? updatedStore : s)
      );
      toast.success(`Store ${updatedStore.storeEngName} updated successfully`);
      return updatedStore;
    } catch (error) {
      console.error('Error updating store:', error);
      toast.error('Failed to update store');
      throw error;
    }
  };

  const deleteStoreSetup = async (id: string) => {
    try {
      await setupService.deleteStoreSetup(id);
      setStoreSetups((prev) => prev.filter((s) => s.id !== id));
      toast.success('Store deleted successfully');
    } catch (error) {
      console.error('Error deleting store:', error);
      toast.error('Failed to delete store');
      throw error;
    }
  };

  const addRegion = async (region: Omit<RegionSetup, 'id' | 'createdAt'>) => {
    try {
      const newRegion = await setupService.addRegion(region);
      setRegions((prev) => [...prev, newRegion]);
      toast.success(`Region ${newRegion.regionEngName} added successfully`);
      return newRegion;
    } catch (error) {
      console.error('Error adding region:', error);
      toast.error('Failed to add region');
      throw error;
    }
  };

  const updateRegion = async (region: RegionSetup) => {
    try {
      const updatedRegion = await setupService.updateRegion(region);
      setRegions((prev) => 
        prev.map((r) => r.id === updatedRegion.id ? updatedRegion : r)
      );
      toast.success(`Region ${updatedRegion.regionEngName} updated successfully`);
      return updatedRegion;
    } catch (error) {
      console.error('Error updating region:', error);
      toast.error('Failed to update region');
      throw error;
    }
  };

  const deleteRegion = async (id: string) => {
    try {
      await setupService.deleteRegion(id);
      setRegions((prev) => prev.filter((r) => r.id !== id));
      toast.success('Region deleted successfully');
    } catch (error) {
      console.error('Error deleting region:', error);
      toast.error('Failed to delete region');
      throw error;
    }
  };

  const linkStoreToRegion = async (storeId: string, regionId: string) => {
    try {
      const newLink = await setupService.linkStoreToRegion(storeId, regionId);
      setStoreRegionLinks((prev) => [...prev, newLink]);
      toast.success('Store linked to region successfully');
      return newLink;
    } catch (error) {
      console.error('Error linking store to region:', error);
      toast.error('Failed to link store to region');
      throw error;
    }
  };

  const unlinkStoreFromRegion = async (linkId: string) => {
    try {
      await setupService.unlinkStoreFromRegion(linkId);
      setStoreRegionLinks((prev) => prev.filter((link) => link.id !== linkId));
      toast.success('Store unlinked from region successfully');
    } catch (error) {
      console.error('Error unlinking store from region:', error);
      toast.error('Failed to unlink store from region');
      throw error;
    }
  };

  const addItemGroup = async (group: Omit<ItemGroup, 'id' | 'createdAt'>) => {
    try {
      const newGroup = await setupService.addItemGroup(group);
      setItemGroups((prev) => [...prev, newGroup]);
      toast.success(`Item group ${newGroup.groupEngName} added successfully`);
      return newGroup;
    } catch (error) {
      console.error('Error adding item group:', error);
      toast.error('Failed to add item group');
      throw error;
    }
  };

  const updateItemGroup = async (group: ItemGroup) => {
    try {
      const updatedGroup = await setupService.updateItemGroup(group);
      setItemGroups((prev) => 
        prev.map((g) => g.id === updatedGroup.id ? updatedGroup : g)
      );
      toast.success(`Item group ${updatedGroup.groupEngName} updated successfully`);
      return updatedGroup;
    } catch (error) {
      console.error('Error updating item group:', error);
      toast.error('Failed to update item group');
      throw error;
    }
  };

  const deleteItemGroup = async (id: string) => {
    try {
      await setupService.deleteItemGroup(id);
      setItemGroups((prev) => prev.filter((g) => g.id !== id));
      toast.success('Item group deleted successfully');
    } catch (error) {
      console.error('Error deleting item group:', error);
      toast.error('Failed to delete item group');
      throw error;
    }
  };

  const addItem = async (item: Omit<Item, 'id' | 'createdAt'>) => {
    try {
      const newItem = await setupService.addItem(item);
      setItems((prev) => [...prev, newItem]);
      toast.success(`Item ${newItem.itemEngName} added successfully`);
      return newItem;
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
      throw error;
    }
  };

  const updateItem = async (item: Item) => {
    try {
      const updatedItem = await setupService.updateItem(item);
      setItems((prev) => 
        prev.map((i) => i.id === updatedItem.id ? updatedItem : i)
      );
      toast.success(`Item ${updatedItem.itemEngName} updated successfully`);
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await setupService.deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
      throw error;
    }
  };

  const addSystemUser = async (user: Omit<SystemUser, 'id' | 'createdAt'>) => {
    try {
      const newUser = await setupService.addSystemUser(user);
      setSystemUsers((prev) => [...prev, newUser]);
      
      const defaultPermissions: Omit<UserPermission, 'id' | 'createdAt'> = {
        userId: newUser.id,
        allowStoreSetup: false,
        allowRegionSetup: false,
        allowNewCustomer: false,
        allowItemGroupsSetup: false,
        allowUserSetup: false
      };
      
      const userPermission = await setupService.addUserPermissions(defaultPermissions);
      setUserPermissions((prev) => [...prev, userPermission]);
      
      toast.success(`User ${newUser.userName} added successfully`);
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      throw error;
    }
  };

  const updateSystemUser = async (user: SystemUser) => {
    try {
      const updatedUser = await setupService.updateSystemUser(user);
      setSystemUsers((prev) => 
        prev.map((u) => u.id === updatedUser.id ? updatedUser : u)
      );
      toast.success(`User ${updatedUser.userName} updated successfully`);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  };

  const deleteSystemUser = async (id: string) => {
    try {
      await setupService.deleteSystemUser(id);
      setSystemUsers((prev) => prev.filter((u) => u.id !== id));
      setUserPermissions((prev) => prev.filter((p) => p.userId !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  };

  const updateUserPermissions = async (permissions: Omit<UserPermission, 'createdAt'>): Promise<UserPermission> => {
    try {
      const updatedPermissions = await setupService.updateUserPermissions(permissions);
      setUserPermissions((prev) => 
        prev.map((p) => p.userId === updatedPermissions.userId ? updatedPermissions : p)
      );
      toast.success('User permissions updated successfully');
      return updatedPermissions;
    } catch (error) {
      console.error('Error updating user permissions:', error);
      toast.error('Failed to update user permissions');
      throw error;
    }
  };

  const checkPermission = (permission: keyof Omit<UserPermission, 'id' | 'userId' | 'createdAt'>, userId: string) => {
    const user = systemUsers.find(u => u.id === userId);
    if (user?.isAdmin) return true;
    const userPermission = userPermissions.find(p => p.userId === userId);
    return userPermission ? userPermission[permission] : false;
  };

  const refetchData = async () => {
    await fetchData();
  };

  return (
    <StoreContext.Provider value={{ 
      customers,
      orders,
      stores,
      storeSetups,
      brands,
      regions,
      storeRegionLinks,
      itemGroups,
      items,
      systemUsers,
      userPermissions,
      loading,
      addCustomer,
      addOrder,
      updateOrderStatus,
      refetchData,
      addBrand,
      updateBrand,
      deleteBrand,
      addStoreSetup,
      updateStoreSetup,
      deleteStoreSetup,
      addRegion,
      updateRegion,
      deleteRegion,
      linkStoreToRegion,
      unlinkStoreFromRegion,
      addItemGroup,
      updateItemGroup,
      deleteItemGroup,
      addItem,
      updateItem,
      deleteItem,
      addSystemUser,
      updateSystemUser,
      deleteSystemUser,
      updateUserPermissions,
      checkPermission
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
