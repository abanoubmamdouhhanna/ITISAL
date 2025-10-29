
import React, { useState } from 'react';
import SetupPageLayout from '@/components/SetupPageLayout';
import { useStore } from '@/context/StoreContext';
import { UserPermission } from '@/lib/setup-types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Save, Lock, Check, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SecuritySetupPage = () => {
  const { t } = useLanguage();
  const { systemUsers, userPermissions, updateUserPermissions } = useStore();
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<UserPermission | null>(null);
  const [allowStoreSetup, setAllowStoreSetup] = useState(false);
  const [allowRegionSetup, setAllowRegionSetup] = useState(false);
  const [allowNewCustomer, setAllowNewCustomer] = useState(false);
  const [allowItemGroupsSetup, setAllowItemGroupsSetup] = useState(false);
  const [allowUserSetup, setAllowUserSetup] = useState(false);
  
  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    
    // Find user's permissions
    const permission = userPermissions.find(p => p.userId === userId);
    setSelectedPermission(permission || null);
    
    if (permission) {
      setAllowStoreSetup(permission.allowStoreSetup);
      setAllowRegionSetup(permission.allowRegionSetup);
      setAllowNewCustomer(permission.allowNewCustomer);
      setAllowItemGroupsSetup(permission.allowItemGroupsSetup);
      setAllowUserSetup(permission.allowUserSetup);
    } else {
      // Reset permissions if none found
      setAllowStoreSetup(false);
      setAllowRegionSetup(false);
      setAllowNewCustomer(false);
      setAllowItemGroupsSetup(false);
      setAllowUserSetup(false);
    }
  };
  
  const handleSave = async () => {
    if (!selectedUserId) {
      alert(t('setup.select_user'));
      return;
    }
    
    try {
      const permissionsToUpdate: Omit<UserPermission, 'createdAt'> = {
        id: selectedPermission?.id || '',
        userId: selectedUserId,
        allowStoreSetup,
        allowRegionSetup,
        allowNewCustomer,
        allowItemGroupsSetup,
        allowUserSetup
      };
      
      await updateUserPermissions(permissionsToUpdate);
    } catch (error) {
      console.error('Error saving permissions:', error);
    }
  };
  
  const isUserAdmin = (userId: string) => {
    const user = systemUsers.find(u => u.id === userId);
    return user?.isAdmin || false;
  };
  
  return (
    <SetupPageLayout
      title={t('setup.security')}
      description={t('setup.security_description')}
      headerTitle={t('setup.security')}
    >
      <div className="space-y-6">
        <div className="bg-secondary p-4 rounded-md space-y-4">
          <h3 className="text-lg font-medium">
            {t('setup.user_permissions')}
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userSelect">{t('setup.select_user')}</Label>
              <Select 
                value={selectedUserId} 
                onValueChange={handleUserChange}
              >
                <SelectTrigger id="userSelect">
                  <SelectValue placeholder={t('setup.select_user')} />
                </SelectTrigger>
                <SelectContent>
                  {systemUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.userName} {user.isAdmin && `(${t('setup.admin')})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedUserId && (
            <>
              {isUserAdmin(selectedUserId) ? (
                <div className="bg-muted p-4 rounded-md text-center">
                  <Lock className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">{t('setup.admin_all_permissions')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('setup.admin_permissions_note')}
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 rounded-md border">
                      <div>
                        <p className="font-medium">{t('setup.allow_store_setup')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('setup.allow_store_setup_desc')}
                        </p>
                      </div>
                      <Switch
                        checked={allowStoreSetup}
                        onCheckedChange={setAllowStoreSetup}
                        id="allowStoreSetup"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-md border">
                      <div>
                        <p className="font-medium">{t('setup.allow_region_setup')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('setup.allow_region_setup_desc')}
                        </p>
                      </div>
                      <Switch
                        checked={allowRegionSetup}
                        onCheckedChange={setAllowRegionSetup}
                        id="allowRegionSetup"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-md border">
                      <div>
                        <p className="font-medium">{t('setup.allow_new_customer')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('setup.allow_new_customer_desc')}
                        </p>
                      </div>
                      <Switch
                        checked={allowNewCustomer}
                        onCheckedChange={setAllowNewCustomer}
                        id="allowNewCustomer"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-md border">
                      <div>
                        <p className="font-medium">{t('setup.allow_item_groups_setup')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('setup.allow_item_groups_setup_desc')}
                        </p>
                      </div>
                      <Switch
                        checked={allowItemGroupsSetup}
                        onCheckedChange={setAllowItemGroupsSetup}
                        id="allowItemGroupsSetup"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between p-4 rounded-md border">
                      <div>
                        <p className="font-medium">{t('setup.allow_user_setup')}</p>
                        <p className="text-sm text-muted-foreground">
                          {t('setup.allow_user_setup_desc')}
                        </p>
                      </div>
                      <Switch
                        checked={allowUserSetup}
                        onCheckedChange={setAllowUserSetup}
                        id="allowUserSetup"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleSave} className="flex items-center gap-1">
                      <Save className="h-4 w-4" />
                      {t('setup.save_permissions')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('setup.user')}</TableHead>
                <TableHead>{t('setup.store_setup')}</TableHead>
                <TableHead>{t('setup.region_setup')}</TableHead>
                <TableHead>{t('setup.new_customer')}</TableHead>
                <TableHead>{t('setup.item_groups_setup')}</TableHead>
                <TableHead>{t('setup.user_setup')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {t('setup.no_users')}
                  </TableCell>
                </TableRow>
              ) : (
                systemUsers.map((user) => {
                  const permission = userPermissions.find(p => p.userId === user.id);
                  const isAdmin = user.isAdmin;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.userName}
                        {isAdmin && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            {t('setup.admin')}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {isAdmin || (permission?.allowStoreSetup) ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {isAdmin || (permission?.allowRegionSetup) ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {isAdmin || (permission?.allowNewCustomer) ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {isAdmin || (permission?.allowItemGroupsSetup) ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {isAdmin || (permission?.allowUserSetup) ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </SetupPageLayout>
  );
};

export default SecuritySetupPage;
