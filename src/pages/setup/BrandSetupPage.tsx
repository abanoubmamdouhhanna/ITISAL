import React, { useState } from 'react';
import SetupPageLayout from '@/components/SetupPageLayout';
import { useStore } from '@/context/StoreContext';
import { Brand } from '@/lib/setup-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash, Save, Upload } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';

const BrandSetupPage = () => {
  const { t } = useLanguage();
  const { brands, addBrand, updateBrand, deleteBrand } = useStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandEngName, setBrandEngName] = useState('');
  const [brandArName, setBrandArName] = useState('');
  const [brandImage, setBrandImage] = useState('');
  
  const handleNewBrand = () => {
    setIsEditing(true);
    setEditingBrand(null);
    setBrandEngName('');
    setBrandArName('');
    setBrandImage('');
  };
  
  const handleEditBrand = (brand: Brand) => {
    setIsEditing(true);
    setEditingBrand(brand);
    setBrandEngName(brand.brandEngName);
    setBrandArName(brand.brandArName);
    setBrandImage(brand.brandImage || '');
  };
  
  const handleDeleteBrand = async (id: string) => {
    if (window.confirm(t('SetupConfirmDelete'))) {
      try {
        await deleteBrand(id);
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };
  
  const handleSave = async () => {
    if (!brandEngName || !brandArName) {
      alert(t('SetupFillAllFields'));
      return;
    }
    
    try {
      if (editingBrand) {
        await updateBrand({
          ...editingBrand,
          brandEngName,
          brandArName,
          brandImage
        });
      } else {
        // Check if a brand already exists
        if (brands.length > 0) {
          alert(t('SetupOnlyOneBrandAllowed'));
          return;
        }
        
        await addBrand({
          brandEngName,
          brandArName,
          brandImage
        });
      }
      
      setIsEditing(false);
      setEditingBrand(null);
      setBrandEngName('');
      setBrandArName('');
      setBrandImage('');
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditingBrand(null);
    setBrandEngName('');
    setBrandArName('');
    setBrandImage('');
  };
  
  return (
    <SetupPageLayout
      title={t('SetupBrands')}
      description={t('SetupBrandsDescription')}
      headerTitle={t('SetupBrands')}
    >
      <div className="space-y-6">
        {!isEditing ? (
          <div className="flex justify-end mb-4">
            <Button 
              onClick={handleNewBrand} 
              className="flex items-center gap-1"
              disabled={brands.length > 0}
            >
              <Plus className="h-4 w-4" />
              {t('SetupAddBrand')}
            </Button>
          </div>
        ) : (
          <div className="bg-secondary p-4 rounded-md space-y-4">
            <h3 className="text-lg font-medium">
              {editingBrand ? t('SetupEditBrand') : t('SetupAddBrand')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brandEngName">{t('SetupBrandEngName')}</Label>
                <Input 
                  id="brandEngName"
                  value={brandEngName} 
                  onChange={(e) => setBrandEngName(e.target.value)} 
                  placeholder={t('SetupBrandEngName')} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brandArName">{t('SetupBrandArName')}</Label>
                <Input 
                  id="brandArName"
                  value={brandArName} 
                  onChange={(e) => setBrandArName(e.target.value)} 
                  placeholder={t('SetupBrandArName')} 
                  dir="rtl"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="brandImage">{t('SetupBrandImage')}</Label>
                <div className="flex gap-2">
                  <Input 
                    id="brandImage"
                    value={brandImage} 
                    onChange={(e) => setBrandImage(e.target.value)} 
                    placeholder={t('SetupBrandImagePlaceholder')} 
                  />
                  <Button variant="outline" size="icon">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                {brandImage && (
                  <div className="mt-2">
                    <img 
                      src={brandImage} 
                      alt="Brand preview" 
                      className="h-20 w-20 object-contain border rounded"
                    />
                  </div>
                )}
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
                <TableHead>{t('SetupBrandImage')}</TableHead>
                <TableHead>{t('SetupBrandEngName')}</TableHead>
                <TableHead>{t('SetupBrandArName')}</TableHead>
                <TableHead className="text-right">{t('SetupActions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {t('SetupNoBrands')}
                  </TableCell>
                </TableRow>
              ) : (
                brands.slice(0, 1).map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      {brand.brandImage ? (
                        <img 
                          src={brand.brandImage} 
                          alt={brand.brandEngName}
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-muted rounded flex items-center justify-center text-xs">
                          No image
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{brand.brandEngName}</TableCell>
                    <TableCell className="text-right" dir="rtl">{brand.brandArName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditBrand(brand)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('SetupEdit')}</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteBrand(brand.id)}
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

export default BrandSetupPage;