
import React, { useState } from 'react';
import SetupPageLayout from '@/components/SetupPageLayout';
import { useStore } from '@/context/StoreContext';
import { RegionSetup } from '@/lib/setup-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash, Save } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';

const RegionSetupPage = () => {
  const { t } = useLanguage();
  const { regions, addRegion, updateRegion, deleteRegion } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingRegion, setEditingRegion] = useState<RegionSetup | null>(null);
  const [regionCode, setRegionCode] = useState('');
  const [regionEngName, setRegionEngName] = useState('');
  const [regionArName, setRegionArName] = useState('');
  const [deliveryValue, setDeliveryValue] = useState('0');
  
  const handleNewRegion = () => {
    setIsEditing(true);
    setEditingRegion(null);
    setRegionCode('');
    setRegionEngName('');
    setRegionArName('');
    setDeliveryValue('0');
  };
  
  const handleEditRegion = (region: RegionSetup) => {
    setIsEditing(true);
    setEditingRegion(region);
    setRegionCode(region.regionCode);
    setRegionEngName(region.regionEngName);
    setRegionArName(region.regionArName);
    setDeliveryValue(region.deliveryValue.toString());
  };
  
  const handleDeleteRegion = async (id: string) => {
    if (window.confirm(t('setup.confirm_delete'))) {
      try {
        await deleteRegion(id);
      } catch (error) {
        console.error('Error deleting region:', error);
      }
    }
  };
  
  const handleSave = async () => {
    if (!regionCode || !regionEngName || !regionArName) {
      alert(t('setup.fill_all_fields'));
      return;
    }
    
    try {
      if (editingRegion) {
        await updateRegion({
          ...editingRegion,
          regionCode,
          regionEngName,
          regionArName,
          deliveryValue: parseFloat(deliveryValue)
        });
      } else {
        await addRegion({
          regionCode,
          regionEngName,
          regionArName,
          deliveryValue: parseFloat(deliveryValue)
        });
      }
      
      setIsEditing(false);
      setEditingRegion(null);
      setRegionCode('');
      setRegionEngName('');
      setRegionArName('');
      setDeliveryValue('0');
    } catch (error) {
      console.error('Error saving region:', error);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditingRegion(null);
    setRegionCode('');
    setRegionEngName('');
    setRegionArName('');
    setDeliveryValue('0');
  };
  
  return (
    <SetupPageLayout
      title={t('setup.regions')}
      description={t('setup.regions_description')}
      headerTitle={t('setup.regions')}
    >
      <div className="space-y-6">
        {!isEditing ? (
          <div className="flex justify-end mb-4">
            <Button onClick={handleNewRegion} className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {t('setup.add_region')}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary p-4 rounded-md space-y-4">
            <h3 className="text-lg font-medium">
              {editingRegion ? t('setup.edit_region') : t('setup.add_region')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regionCode">{t('setup.region_code')}</Label>
                <Input 
                  id="regionCode"
                  value={regionCode} 
                  onChange={(e) => setRegionCode(e.target.value)} 
                  placeholder={t('setup.region_code')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regionEngName">{t('setup.region_eng_name')}</Label>
                <Input 
                  id="regionEngName"
                  value={regionEngName} 
                  onChange={(e) => setRegionEngName(e.target.value)} 
                  placeholder={t('setup.region_eng_name')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="regionArName">{t('setup.region_ar_name')}</Label>
                <Input 
                  id="regionArName"
                  value={regionArName} 
                  onChange={(e) => setRegionArName(e.target.value)} 
                  placeholder={t('setup.region_ar_name')} 
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryValue">{t('setup.delivery_value')}</Label>
                <Input 
                  id="deliveryValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={deliveryValue} 
                  onChange={(e) => setDeliveryValue(e.target.value)} 
                  placeholder={t('setup.delivery_value')} 
                />
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
                <TableHead>{t('setup.region_code')}</TableHead>
                <TableHead>{t('setup.region_eng_name')}</TableHead>
                <TableHead>{t('setup.region_ar_name')}</TableHead>
                <TableHead>{t('setup.delivery_value')}</TableHead>
                <TableHead className="text-right">{t('setup.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {t('setup.no_regions')}
                  </TableCell>
                </TableRow>
              ) : (
                regions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell>{region.regionCode}</TableCell>
                    <TableCell>{region.regionEngName}</TableCell>
                    <TableCell className="text-right" dir="rtl">{region.regionArName}</TableCell>
                    <TableCell>{region.deliveryValue}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditRegion(region)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('setup.edit')}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteRegion(region.id)}
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

export default RegionSetupPage;
