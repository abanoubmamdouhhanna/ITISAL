import { supabase } from "@/integrations/supabase/client";
import { 
  StoreSetup, 
  RegionSetup, 
  StoreRegionLink, 
  ItemGroup, 
  Item, 
  SystemUser, 
  UserPermission,
  Brand
} from "@/lib/setup-types";

// Brand Setup Services
export const fetchBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('brand_eng_name', { ascending: true });
  
  if (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
  
  return data.map(brand => ({
    id: brand.id,
    brandEngName: brand.brand_eng_name,
    brandArName: brand.brand_ar_name,
    brandImage: brand.brand_image,
    createdAt: brand.created_at
  }));
};

export const addBrand = async (brand: Omit<Brand, 'id' | 'createdAt'>): Promise<Brand> => {
  const { data, error } = await supabase
    .from('brands')
    .insert([{
      brand_eng_name: brand.brandEngName,
      brand_ar_name: brand.brandArName,
      brand_image: brand.brandImage
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding brand:', error);
    throw error;
  }
  
  return {
    id: data.id,
    brandEngName: data.brand_eng_name,
    brandArName: data.brand_ar_name,
    brandImage: data.brand_image,
    createdAt: data.created_at
  };
};

export const updateBrand = async (brand: Brand): Promise<Brand> => {
  const { data, error } = await supabase
    .from('brands')
    .update({
      brand_eng_name: brand.brandEngName,
      brand_ar_name: brand.brandArName,
      brand_image: brand.brandImage
    })
    .eq('id', brand.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating brand:', error);
    throw error;
  }
  
  return {
    id: data.id,
    brandEngName: data.brand_eng_name,
    brandArName: data.brand_ar_name,
    brandImage: data.brand_image,
    createdAt: data.created_at
  };
};

export const deleteBrand = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting brand:', error);
    throw error;
  }
};

// Store Setup Services
export const fetchStoreSetups = async (): Promise<StoreSetup[]> => {
  const { data, error } = await supabase
    .from('store_setup')
    .select(`
      *,
      brands (id, brand_eng_name)
    `)
    .order('store_code', { ascending: true });
  
  if (error) {
    console.error('Error fetching store setups:', error);
    throw error;
  }
  
  return data.map(store => ({
    id: store.id,
    storeCode: store.store_code,
    storeEngName: store.store_eng_name,
    storeArName: store.store_ar_name,
    brandId: store.brand_id,
    brandName: store.brands?.brand_eng_name,
    createdAt: store.created_at
  }));
};

export const addStoreSetup = async (store: Omit<StoreSetup, 'id' | 'createdAt'>): Promise<StoreSetup> => {
  const { data, error } = await supabase
    .from('store_setup')
    .insert([{
      store_code: store.storeCode,
      store_eng_name: store.storeEngName,
      store_ar_name: store.storeArName,
      brand_id: store.brandId
    }])
    .select(`
      *,
      brands (id, brand_eng_name)
    `)
    .single();
  
  if (error) {
    console.error('Error adding store setup:', error);
    throw error;
  }
  
  return {
    id: data.id,
    storeCode: data.store_code,
    storeEngName: data.store_eng_name,
    storeArName: data.store_ar_name,
    brandId: data.brand_id,
    brandName: data.brands?.brand_eng_name,
    createdAt: data.created_at
  };
};

export const updateStoreSetup = async (store: StoreSetup): Promise<StoreSetup> => {
  const { data, error } = await supabase
    .from('store_setup')
    .update({
      store_code: store.storeCode,
      store_eng_name: store.storeEngName,
      store_ar_name: store.storeArName,
      brand_id: store.brandId
    })
    .eq('id', store.id)
    .select(`
      *,
      brands (id, brand_eng_name)
    `)
    .single();
  
  if (error) {
    console.error('Error updating store setup:', error);
    throw error;
  }
  
  return {
    id: data.id,
    storeCode: data.store_code,
    storeEngName: data.store_eng_name,
    storeArName: data.store_ar_name,
    brandId: data.brand_id,
    brandName: data.brands?.brand_eng_name,
    createdAt: data.created_at
  };
};

export const deleteStoreSetup = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('store_setup')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting store setup:', error);
    throw error;
  }
};

// Region Setup Services
export const fetchRegions = async (): Promise<RegionSetup[]> => {
  const { data, error } = await supabase
    .from('region_setup')
    .select('*')
    .order('region_code', { ascending: true });
  
  if (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
  
  return data.map(region => ({
    id: region.id,
    regionCode: region.region_code,
    regionEngName: region.region_eng_name,
    regionArName: region.region_ar_name,
    deliveryValue: region.delivery_value,
    createdAt: region.created_at
  }));
};

export const addRegion = async (region: Omit<RegionSetup, 'id' | 'createdAt'>): Promise<RegionSetup> => {
  const { data, error } = await supabase
    .from('region_setup')
    .insert([{
      region_code: region.regionCode,
      region_eng_name: region.regionEngName,
      region_ar_name: region.regionArName,
      delivery_value: region.deliveryValue
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding region:', error);
    throw error;
  }
  
  return {
    id: data.id,
    regionCode: data.region_code,
    regionEngName: data.region_eng_name,
    regionArName: data.region_ar_name,
    deliveryValue: data.delivery_value,
    createdAt: data.created_at
  };
};

export const updateRegion = async (region: RegionSetup): Promise<RegionSetup> => {
  const { data, error } = await supabase
    .from('region_setup')
    .update({
      region_code: region.regionCode,
      region_eng_name: region.regionEngName,
      region_ar_name: region.regionArName,
      delivery_value: region.deliveryValue
    })
    .eq('id', region.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating region:', error);
    throw error;
  }
  
  return {
    id: data.id,
    regionCode: data.region_code,
    regionEngName: data.region_eng_name,
    regionArName: data.region_ar_name,
    deliveryValue: data.delivery_value,
    createdAt: data.created_at
  };
};

export const deleteRegion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('region_setup')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting region:', error);
    throw error;
  }
};

// Store-Region Link Services
export const fetchStoreRegionLinks = async (): Promise<StoreRegionLink[]> => {
  const { data, error } = await supabase
    .from('store_region_links')
    .select(`
      *,
      store_setup (id, store_eng_name),
      region_setup (id, region_eng_name)
    `);
  
  if (error) {
    console.error('Error fetching store-region links:', error);
    throw error;
  }
  
  return data.map(link => ({
    id: link.id,
    storeId: link.store_id,
    regionId: link.region_id,
    isActive: link.is_active,
    createdAt: link.created_at,
    storeName: link.store_setup?.store_eng_name,
    regionName: link.region_setup?.region_eng_name
  }));
};

export const linkStoreToRegion = async (storeId: string, regionId: string): Promise<StoreRegionLink> => {
  const { data, error } = await supabase
    .from('store_region_links')
    .insert([{
      store_id: storeId,
      region_id: regionId,
      is_active: true
    }])
    .select(`
      *,
      store_setup (id, store_eng_name),
      region_setup (id, region_eng_name)
    `)
    .single();
  
  if (error) {
    console.error('Error linking store to region:', error);
    throw error;
  }
  
  return {
    id: data.id,
    storeId: data.store_id,
    regionId: data.region_id,
    isActive: data.is_active,
    createdAt: data.created_at,
    storeName: data.store_setup?.store_eng_name,
    regionName: data.region_setup?.region_eng_name
  };
};

export const unlinkStoreFromRegion = async (linkId: string): Promise<void> => {
  const { error } = await supabase
    .from('store_region_links')
    .delete()
    .eq('id', linkId);
  
  if (error) {
    console.error('Error unlinking store from region:', error);
    throw error;
  }
};

// Item Group Services
export const fetchItemGroups = async (): Promise<ItemGroup[]> => {
  const { data, error } = await supabase
    .from('item_groups')
    .select('*')
    .order('group_code', { ascending: true });
  
  if (error) {
    console.error('Error fetching item groups:', error);
    throw error;
  }
  
  // Convert the flat array into a nested tree structure
  const groups = data.map(group => ({
    id: group.id,
    groupCode: group.group_code,
    groupEngName: group.group_eng_name,
    groupArName: group.group_ar_name,
    parentGroupId: group.parent_group_id,
    vatPercentage: group.vat_percentage,
    createdAt: group.created_at,
    children: []
  }));
  
  // Build tree structure
  const groupsMap = new Map<string, ItemGroup>();
  groups.forEach(group => groupsMap.set(group.id, group));
  
  const rootGroups: ItemGroup[] = [];
  
  groups.forEach(group => {
    if (group.parentGroupId) {
      const parent = groupsMap.get(group.parentGroupId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(group);
      } else {
        rootGroups.push(group);
      }
    } else {
      rootGroups.push(group);
    }
  });
  
  return groups;
};

export const addItemGroup = async (group: Omit<ItemGroup, 'id' | 'createdAt'>): Promise<ItemGroup> => {
  const { data, error } = await supabase
    .from('item_groups')
    .insert([{
      group_code: group.groupCode,
      group_eng_name: group.groupEngName,
      group_ar_name: group.groupArName,
      parent_group_id: group.parentGroupId,
      vat_percentage: group.vatPercentage
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding item group:', error);
    throw error;
  }
  
  return {
    id: data.id,
    groupCode: data.group_code,
    groupEngName: data.group_eng_name,
    groupArName: data.group_ar_name,
    parentGroupId: data.parent_group_id,
    vatPercentage: data.vat_percentage,
    createdAt: data.created_at
  };
};

export const updateItemGroup = async (group: ItemGroup): Promise<ItemGroup> => {
  const { data, error } = await supabase
    .from('item_groups')
    .update({
      group_code: group.groupCode,
      group_eng_name: group.groupEngName,
      group_ar_name: group.groupArName,
      parent_group_id: group.parentGroupId,
      vat_percentage: group.vatPercentage
    })
    .eq('id', group.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating item group:', error);
    throw error;
  }
  
  return {
    id: data.id,
    groupCode: data.group_code,
    groupEngName: data.group_eng_name,
    groupArName: data.group_ar_name,
    parentGroupId: data.parent_group_id,
    vatPercentage: data.vat_percentage,
    createdAt: data.created_at
  };
};

export const deleteItemGroup = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('item_groups')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting item group:', error);
    throw error;
  }
};

// Item Services
export const fetchItems = async (): Promise<Item[]> => {
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      item_groups (id, group_eng_name)
    `)
    .order('item_code', { ascending: true });
  
  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
  
  return data.map(item => ({
    id: item.id,
    itemCode: item.item_code,
    itemEngName: item.item_eng_name,
    itemArName: item.item_ar_name,
    groupId: item.group_id,
    uom: item.uom,
    price: item.price,
    createdAt: item.created_at,
    groupName: item.item_groups?.group_eng_name
  }));
};

export const addItem = async (item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> => {
  const { data, error } = await supabase
    .from('items')
    .insert([{
      item_code: item.itemCode,
      item_eng_name: item.itemEngName,
      item_ar_name: item.itemArName,
      group_id: item.groupId,
      uom: item.uom,
      price: item.price
    }])
    .select(`
      *,
      item_groups (id, group_eng_name)
    `)
    .single();
  
  if (error) {
    console.error('Error adding item:', error);
    throw error;
  }
  
  return {
    id: data.id,
    itemCode: data.item_code,
    itemEngName: data.item_eng_name,
    itemArName: data.item_ar_name,
    groupId: data.group_id,
    uom: data.uom,
    price: data.price,
    createdAt: data.created_at,
    groupName: data.item_groups?.group_eng_name
  };
};

export const updateItem = async (item: Item): Promise<Item> => {
  const { data, error } = await supabase
    .from('items')
    .update({
      item_code: item.itemCode,
      item_eng_name: item.itemEngName,
      item_ar_name: item.itemArName,
      group_id: item.groupId,
      uom: item.uom,
      price: item.price
    })
    .eq('id', item.id)
    .select(`
      *,
      item_groups (id, group_eng_name)
    `)
    .single();
  
  if (error) {
    console.error('Error updating item:', error);
    throw error;
  }
  
  return {
    id: data.id,
    itemCode: data.item_code,
    itemEngName: data.item_eng_name,
    itemArName: data.item_ar_name,
    groupId: data.group_id,
    uom: data.uom,
    price: data.price,
    createdAt: data.created_at,
    groupName: data.item_groups?.group_eng_name
  };
};

export const deleteItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

// System User Services
export const fetchSystemUsers = async (): Promise<SystemUser[]> => {
  const { data, error } = await supabase
    .from('system_users')
    .select('*')
    .order('user_code', { ascending: true });
  
  if (error) {
    console.error('Error fetching system users:', error);
    throw error;
  }
  
  return data.map(user => ({
    id: user.id,
    userCode: user.user_code,
    userName: user.user_name,
    password: user.password,
    isAdmin: user.is_admin,
    createdAt: user.created_at
  }));
};

export const addSystemUser = async (user: Omit<SystemUser, 'id' | 'createdAt'>): Promise<SystemUser> => {
  const { data, error } = await supabase
    .from('system_users')
    .insert([{
      user_code: user.userCode,
      user_name: user.userName,
      password: user.password,
      is_admin: user.isAdmin
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding system user:', error);
    throw error;
  }
  
  return {
    id: data.id,
    userCode: data.user_code,
    userName: data.user_name,
    password: data.password,
    isAdmin: data.is_admin,
    createdAt: data.created_at
  };
};

export const updateSystemUser = async (user: SystemUser): Promise<SystemUser> => {
  const { data, error } = await supabase
    .from('system_users')
    .update({
      user_code: user.userCode,
      user_name: user.userName,
      password: user.password,
      is_admin: user.isAdmin
    })
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating system user:', error);
    throw error;
  }
  
  return {
    id: data.id,
    userCode: data.user_code,
    userName: data.user_name,
    password: data.password,
    isAdmin: data.is_admin,
    createdAt: data.created_at
  };
};

export const deleteSystemUser = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('system_users')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting system user:', error);
    throw error;
  }
};

// User Permissions Services
export const fetchUserPermissions = async (): Promise<UserPermission[]> => {
  const { data, error } = await supabase
    .from('user_permissions')
    .select('*');
  
  if (error) {
    console.error('Error fetching user permissions:', error);
    throw error;
  }
  
  return data.map(permissions => ({
    id: permissions.id,
    userId: permissions.user_id,
    allowStoreSetup: permissions.allow_store_setup,
    allowRegionSetup: permissions.allow_region_setup,
    allowNewCustomer: permissions.allow_new_customer,
    allowItemGroupsSetup: permissions.allow_item_groups_setup,
    allowUserSetup: permissions.allow_user_setup,
    createdAt: permissions.created_at
  }));
};

export const addUserPermissions = async (permissions: Omit<UserPermission, 'id' | 'createdAt'>): Promise<UserPermission> => {
  const { data, error } = await supabase
    .from('user_permissions')
    .insert([{
      user_id: permissions.userId,
      allow_store_setup: permissions.allowStoreSetup,
      allow_region_setup: permissions.allowRegionSetup,
      allow_new_customer: permissions.allowNewCustomer,
      allow_item_groups_setup: permissions.allowItemGroupsSetup,
      allow_user_setup: permissions.allowUserSetup
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding user permissions:', error);
    throw error;
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    allowStoreSetup: data.allow_store_setup,
    allowRegionSetup: data.allow_region_setup,
    allowNewCustomer: data.allow_new_customer,
    allowItemGroupsSetup: data.allow_item_groups_setup,
    allowUserSetup: data.allow_user_setup,
    createdAt: data.created_at
  };
};

export const updateUserPermissions = async (permissions: Omit<UserPermission, 'createdAt'>): Promise<UserPermission> => {
  const { data, error } = await supabase
    .from('user_permissions')
    .update({
      allow_store_setup: permissions.allowStoreSetup,
      allow_region_setup: permissions.allowRegionSetup,
      allow_new_customer: permissions.allowNewCustomer,
      allow_item_groups_setup: permissions.allowItemGroupsSetup,
      allow_user_setup: permissions.allowUserSetup
    })
    .eq('id', permissions.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating user permissions:', error);
    throw error;
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    allowStoreSetup: data.allow_store_setup,
    allowRegionSetup: data.allow_region_setup,
    allowNewCustomer: data.allow_new_customer,
    allowItemGroupsSetup: data.allow_item_groups_setup,
    allowUserSetup: data.allow_user_setup,
    createdAt: data.created_at
  };
};
