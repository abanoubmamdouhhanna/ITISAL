
import React, { useState } from 'react';
import SetupPageLayout from '@/components/SetupPageLayout';
import { useStore } from '@/context/StoreContext';
import { StoreSetup } from '@/lib/setup-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const StoreSetupPage = () => {
  const { t } = useLanguage();
  const { storeSetups, addStoreSetup, updateStoreSetup, deleteStoreSetup } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreSetup | null>(null);
  const [storeCode, setStoreCode] = useState('');
  const [storeEngName, setStoreEngName] = useState('');
  const [storeArName, setStoreArName] = useState('');
  const [brandId, setBrandId] = useState<string>('');
  
  const handleNewStore = () => {
    setIsEditing(true);
    setEditingStore(null);
    setStoreCode('');
    setStoreEngName('');
    setStoreArName('');
    setBrandId('');
  };
  
  const handleEditStore = (store: StoreSetup) => {
    setIsEditing(true);
    setEditingStore(store);
    setStoreCode(store.storeCode);
    setStoreEngName(store.storeEngName);
    setStoreArName(store.storeArName);
    setBrandId(store.brandId || '');
  };
  
  const handleDeleteStore = async (id: string) => {
    if (window.confirm(t('SetupConfirmDelete'))) {
      try {
        await deleteStoreSetup(id);
      } catch (error) {
        console.error('Error deleting store:', error);
      }
    }
  };
  
  const handleSave = async () => {
    if (!storeCode || !storeEngName || !storeArName) {
      alert(t('SetupFillAllFields'));
      return;
    }
    
    try {
      if (editingStore) {
        await updateStoreSetup({
          ...editingStore,
          storeCode,
          storeEngName,
          storeArName,
          brandId
        });
      } else {
        await addStoreSetup({
          storeCode,
          storeEngName,
          storeArName,
          brandId
        });
      }
      
      setIsEditing(false);
      setEditingStore(null);
      setStoreCode('');
      setStoreEngName('');
      setStoreArName('');
      setBrandId('');
    } catch (error) {
      console.error('Error saving store:', error);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditingStore(null);
    setStoreCode('');
    setStoreEngName('');
    setStoreArName('');
    setBrandId('');
  };
  
  return (
    <SetupPageLayout
      title={t('SetupStores')}
      description={t('SetupStoresDescription')}
      headerTitle={t('SetupStores')}
    >
      <div className="space-y-6">
        {!isEditing ? (
          <div className="flex justify-end mb-4">
            <Button onClick={handleNewStore} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {t('SetupAddStore')}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary p-4 rounded-md space-y-4">
            <h3 className="text-lg font-medium">
              {editingStore ? t('SetupEditStore') : t('SetupAddStore')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeCode">{t('SetupStoreCode')}</Label>
                <Input 
                  id="storeCode"
                  value={storeCode} 
                  onChange={(e) => setStoreCode(e.target.value)} 
                  placeholder={t('SetupStoreCode')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeEngName">{t('SetupStoreEngName')}</Label>
                <Input 
                  id="storeEngName"
                  value={storeEngName} 
                  onChange={(e) => setStoreEngName(e.target.value)} 
                  placeholder={t('SetupStoreEngName')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="storeArName">{t('SetupStoreArName')}</Label>
                <Input 
                  id="storeArName"
                  value={storeArName} 
                  onChange={(e) => setStoreArName(e.target.value)} 
                  placeholder={t('SetupStoreArName')} 
                  dir="rtl"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                {t('SetupCancel')}
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-1">
                <Save className="h-4 w-4" />
                {t('SetupSave')}
              </Button>
            </div>
          </div>
        )}
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('SetupStoreCode')}</TableHead>
                <TableHead>{t('SetupStoreEngName')}</TableHead>
                <TableHead>{t('SetupStoreArName')}</TableHead>
                <TableHead className="text-right">{t('SetupActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeSetups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {t('SetupNoStores')}
                  </TableCell>
                </TableRow>
              ) : (
                storeSetups.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>{store.storeCode}</TableCell>
                    <TableCell>{store.storeEngName}</TableCell>
                    <TableCell className="text-right" dir="rtl">{store.storeArName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditStore(store)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('SetupEdit')}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">{t('SetupDelete')}</span>
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

export default StoreSetupPage;
