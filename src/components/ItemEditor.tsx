
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { OrderItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Percent, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

interface ItemEditorProps {
  item: OrderItem;
  onUpdate: (item: OrderItem) => void;
  onClose?: () => void; // Add a close callback
}

const ItemEditor: React.FC<ItemEditorProps> = ({ item, onUpdate, onClose }) => {
  const [notes, setNotes] = useState(item.notes || '');
  const [discount, setDiscount] = useState(item.discount || 0);
  const { t } = useLanguage();

  const handleSave = () => {
    // Create the updated item
    const updatedItem = {
      ...item,
      notes,
      discount
    };
    
    // Call the update function with the updated item
    onUpdate(updatedItem);
    
    // Show success toast
    toast.success(t('item_editor.success'));
    
    // Close the popup if onClose callback is provided
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="space-y-1">
        <Label htmlFor="notes" className="text-xs flex items-center gap-1">
          <MessageSquare className="h-3 w-3" /> {t('item_editor.notes')}
        </Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="h-20 text-xs"
          placeholder={t('item_editor.special_instructions')}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="discount" className="text-xs flex items-center gap-1">
          <Percent className="h-3 w-3" /> {t('item_editor.discount')}
        </Label>
        <Input
          id="discount"
          type="number"
          min="0"
          max="100"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="text-xs"
        />
      </div>
      
      <Button size="sm" onClick={handleSave} className="w-full">
        {t('item_editor.apply_changes')}
      </Button>
    </div>
  );
};

export default ItemEditor;
