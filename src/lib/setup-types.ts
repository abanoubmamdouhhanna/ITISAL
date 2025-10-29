
export interface Brand {
  id: string;
  brandEngName: string;
  brandArName: string;
  brandImage?: string;
  createdAt: string;
}

export interface StoreSetup {
  id: string;
  storeCode: string;
  storeEngName: string;
  storeArName: string;
  brandId?: string;
  createdAt: string;
  // Derived properties for UI
  brandName?: string;
}

export interface RegionSetup {
  id: string;
  regionCode: string;
  regionEngName: string;
  regionArName: string;
  deliveryValue: number;
  createdAt: string;
}

export interface StoreRegionLink {
  id: string;
  storeId: string;
  regionId: string;
  isActive: boolean;
  createdAt: string;
  // Derived properties for UI
  storeName?: string;
  regionName?: string;
}

export interface ItemGroup {
  id: string;
  groupCode: string;
  groupEngName: string;
  groupArName: string;
  parentGroupId: string | null;
  vatPercentage: number;
  createdAt: string;
  // Derived properties for UI
  children?: ItemGroup[];
}

export interface Item {
  id: string;
  itemCode: string;
  itemEngName: string;
  itemArName: string;
  groupId: string;
  uom: string;
  price: number;
  createdAt: string;
  // Derived properties for UI
  groupName?: string;
}

export interface SystemUser {
  id: string;
  userCode: string;
  userName: string;
  password: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface UserPermission {
  id: string;
  userId: string;
  allowStoreSetup: boolean;
  allowRegionSetup: boolean;
  allowNewCustomer: boolean;
  allowItemGroupsSetup: boolean;
  allowUserSetup: boolean;
  createdAt: string;
}
