
import React, { useState } from 'react';
import SetupPageLayout from '@/components/SetupPageLayout';
import { useStore } from '@/context/StoreContext';
import { SystemUser } from '@/lib/setup-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash, Save, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const UserSetupPage = () => {
  const { t } = useLanguage();
  const { systemUsers, addSystemUser, updateSystemUser, deleteSystemUser } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [userCode, setUserCode] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const handleNewUser = () => {
    setIsEditing(true);
    setEditingUser(null);
    setUserCode('');
    setUserName('');
    setPassword('');
    setIsAdmin(false);
  };
  
  const handleEditUser = (user: SystemUser) => {
    setIsEditing(true);
    setEditingUser(user);
    setUserCode(user.userCode);
    setUserName(user.userName);
    setPassword(user.password);
    setIsAdmin(user.isAdmin);
  };
  
  const handleDeleteUser = async (id: string) => {
    if (window.confirm(t('setup.confirm_delete'))) {
      try {
        await deleteSystemUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
  
  const handleSave = async () => {
    if (!userCode || !userName || !password) {
      alert(t('setup.fill_all_fields'));
      return;
    }
    
    try {
      if (editingUser) {
        await updateSystemUser({
          ...editingUser,
          userCode,
          userName,
          password,
          isAdmin
        });
      } else {
        await addSystemUser({
          userCode,
          userName,
          password,
          isAdmin
        });
      }
      
      setIsEditing(false);
      setEditingUser(null);
      setUserCode('');
      setUserName('');
      setPassword('');
      setIsAdmin(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditingUser(null);
    setUserCode('');
    setUserName('');
    setPassword('');
    setIsAdmin(false);
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <SetupPageLayout
      title={t('setup.users')}
      description={t('setup.users_description')}
      headerTitle={t('setup.users')}
    >
      <div className="space-y-6">
        {!isEditing ? (
          <div className="flex justify-end mb-4">
            <Button onClick={handleNewUser} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {t('setup.add_user')}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary p-4 rounded-md space-y-4">
            <h3 className="text-lg font-medium">
              {editingUser ? t('setup.edit_user') : t('setup.add_user')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="userCode">{t('setup.user_code')}</Label>
                <Input 
                  id="userCode"
                  value={userCode} 
                  onChange={(e) => setUserCode(e.target.value)} 
                  placeholder={t('setup.user_code')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userName">{t('setup.user_name')}</Label>
                <Input 
                  id="userName"
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  placeholder={t('setup.user_name')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('setup.password')}</Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder={t('setup.password')} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 flex items-center">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isAdmin}
                    onCheckedChange={setIsAdmin}
                    id="isAdmin"
                  />
                  <Label htmlFor="isAdmin" className="cursor-pointer">
                    {t('setup.is_admin')}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {t('setup.cancel')}
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                {t('setup.save')}
              </Button>
            </div>
          </div>
        )}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('setup.user_code')}</TableHead>
                <TableHead>{t('setup.user_name')}</TableHead>
                <TableHead>{t('setup.is_admin')}</TableHead>
                <TableHead className="text-right">{t('setup.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systemUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {t('setup.no_users')}
                  </TableCell>
                </TableRow>
              ) : (
                systemUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.userCode}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <span className="text-green-600 font-medium">{t('setup.yes')}</span>
                      ) : (
                        <span className="text-gray-500">{t('setup.no')}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('setup.edit')}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">{t('setup.delete')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </SetupPageLayout>
  );
};

export default UserSetupPage;
