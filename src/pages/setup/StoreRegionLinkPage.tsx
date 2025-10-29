
import React, { useState } from 'react';
import SetupPageLayout from '@/components/SetupPageLayout';
import { useStore } from '@/context/StoreContext';
import { StoreSetup, RegionSetup, StoreRegionLink } from '@/lib/setup-types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StoreRegionLinkPage = () => {
  const { t } = useLanguage();
  const { storeSetups, regions, storeRegionLinks, linkStoreToRegion, unlinkStoreFromRegion } = useStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  
  const handleNewLink = () => {
    setIsAdding(true);
    setSelectedStoreId('');
    setSelectedRegionId('');
  };
  
  const handleDeleteLink = async (id: string) => {
    if (window.confirm(t('setup.confirm_delete'))) {
      try {
        await unlinkStoreFromRegion(id);
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    }
  };
  
  const handleSave = async () => {
    if (!selectedStoreId || !selectedRegionId) {
      alert(t('setup.select_store_and_region'));
      return;
    }
    
    // Check if this link already exists
    const exists = storeRegionLinks.some(
      link => link.storeId === selectedStoreId && link.regionId === selectedRegionId
    );
    
    if (exists) {
      alert(t('setup.link_already_exists'));
      return;
    }
    
    try {
      await linkStoreToRegion(selectedStoreId, selectedRegionId);
      
      setIsAdding(false);
      setSelectedStoreId('');
      setSelectedRegionId('');
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };
  
  const handleCancel = () => {
    setIsAdding(false);
    setSelectedStoreId('');
    setSelectedRegionId('');
  };
  
  const getStoreName = (id: string) => {
    const store = storeSetups.find(s => s.id === id);
    return store ? store.storeEngName : id;
  };
  
  const getRegionName = (id: string) => {
    const region = regions.find(r => r.id === id);
    return region ? region.regionEngName : id;
  };
  
  return (
    <SetupPageLayout
      title={t('setup.store_regions')}
      description={t('setup.store_regions_description')}
      headerTitle={t('setup.store_regions')}
    >
      <div className="space-y-6">
        {!isAdding ? (
          <div className="flex justify-end mb-4">
            <Button onClick={handleNewLink} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {t('setup.add_link')}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary p-4 rounded-md space-y-4">
            <h3 className="text-lg font-medium">
              {t('setup.add_link')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeSelect">{t('setup.select_store')}</Label>
                <Select 
                  value={selectedStoreId} 
                  onValueChange={setSelectedStoreId}
                >
                  <SelectTrigger id="storeSelect">
                    <SelectValue placeholder={t('setup.select_store')} />
                  </SelectTrigger>
                  <SelectContent>
                    {storeSetups.map((store) => (
                      <SelectItem key={store.id} value={store.id}>
                        {store.storeEngName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regionSelect">{t('setup.select_region')}</Label>
                <Select 
                  value={selectedRegionId} 
                  onValueChange={setSelectedRegionId}
                >
                  <SelectTrigger id="regionSelect">
                    <SelectValue placeholder={t('setup.select_region')} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.regionEngName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <TableHead>{t('setup.store')}</TableHead>
                <TableHead>{t('setup.region')}</TableHead>
                <TableHead className="text-right">{t('setup.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeRegionLinks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    {t('setup.no_links')}
                  </TableCell>
                </TableRow>
              ) : (
                storeRegionLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>{link.storeName || getStoreName(link.storeId)}</TableCell>
                    <TableCell>{link.regionName || getRegionName(link.regionId)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">{t('setup.delete')}</span>
                      </Button>
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

export default StoreRegionLinkPage;
