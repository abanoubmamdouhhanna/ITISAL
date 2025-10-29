import React, { useState, useEffect } from 'react';
import SetupPageLayout from '@/components/SetupPageLayout';
import { useStore } from '@/context/StoreContext';
import { ItemGroup, Item } from '@/lib/setup-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash, Save, ChevronRight, ChevronDown, Package, FolderClosed, FileText } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type TreeNode = ItemGroup | Item;
type TreeNodeType = 'group' | 'item';

interface TreeViewProps {
  data: (ItemGroup | Item)[];
  onSelectNode: (node: TreeNode, type: TreeNodeType) => void;
}

const ItemSetupPage = () => {
  const { t } = useLanguage();
  const { itemGroups, items, addItemGroup, updateItemGroup, deleteItemGroup, addItem, updateItem, deleteItem } = useStore();
  
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [selectedType, setSelectedType] = useState<TreeNodeType | null>(null);
  
  // Group Form State
  const [groupCode, setGroupCode] = useState('');
  const [groupEngName, setGroupEngName] = useState('');
  const [groupArName, setGroupArName] = useState('');
  const [parentGroupId, setParentGroupId] = useState<string | null>(null);
  const [vatPercentage, setVatPercentage] = useState('15');
  
  // Item Form State
  const [itemCode, setItemCode] = useState('');
  const [itemEngName, setItemEngName] = useState('');
  const [itemArName, setItemArName] = useState('');
  const [itemGroupId, setItemGroupId] = useState('');
  const [itemUom, setItemUom] = useState('');
  const [itemPrice, setItemPrice] = useState('0');
  
  // Tree state
  const [treeData, setTreeData] = useState<(ItemGroup | Item)[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // Mode state
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  
  useEffect(() => {
    const groupsMap = new Map<string, ItemGroup & { items?: Item[] }>();
    
    // Clone groups and add items array
    itemGroups.forEach(group => {
      groupsMap.set(group.id, {
        ...group,
        items: []
      });
    });
    
    // Add items to their respective groups
    items.forEach(item => {
      const group = groupsMap.get(item.groupId);
      if (group) {
        if (!group.items) group.items = [];
        group.items.push(item);
      }
    });
    
    // Build the tree structure
    const rootGroups: (ItemGroup & { items?: Item[] })[] = [];
    
    itemGroups.forEach(group => {
      const node = groupsMap.get(group.id);
      if (!node) return;
      
      if (group.parentGroupId) {
        const parent = groupsMap.get(group.parentGroupId);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(node);
        } else {
          rootGroups.push(node);
        }
      } else {
        rootGroups.push(node);
      }
    });
    
    setTreeData(rootGroups);
  }, [itemGroups, items]);
  
  const handleSelectNode = (node: TreeNode, type: TreeNodeType) => {
    setSelectedNode(node);
    setSelectedType(type);
    
    if (type === 'group') {
      const group = node as ItemGroup;
      setGroupCode(group.groupCode);
      setGroupEngName(group.groupEngName);
      setGroupArName(group.groupArName);
      setParentGroupId(group.parentGroupId);
      setVatPercentage(group.vatPercentage.toString());
      
      setIsCreatingGroup(false);
      setIsCreatingItem(false);
    } else {
      const item = node as Item;
      setItemCode(item.itemCode);
      setItemEngName(item.itemEngName);
      setItemArName(item.itemArName);
      setItemGroupId(item.groupId);
      setItemUom(item.uom);
      setItemPrice(item.price.toString());
      
      setIsCreatingGroup(false);
      setIsCreatingItem(false);
    }
  };
  
  const handleNewGroup = () => {
    setSelectedNode(null);
    setSelectedType('group');
    setGroupCode('');
    setGroupEngName('');
    setGroupArName('');
    setParentGroupId(null);
    setVatPercentage('15');
    setIsCreatingGroup(true);
    setIsCreatingItem(false);
  };
  
  const handleNewItem = () => {
    setSelectedNode(null);
    setSelectedType('item');
    setItemCode('');
    setItemEngName('');
    setItemArName('');
    setItemGroupId('');
    setItemUom('');
    setItemPrice('0');
    setIsCreatingItem(true);
    setIsCreatingGroup(false);
  };
  
  const handleDeleteGroup = async (id: string) => {
    if (window.confirm(t('setup.confirm_delete'))) {
      try {
        await deleteItemGroup(id);
        setSelectedNode(null);
        setSelectedType(null);
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };
  
  const handleDeleteItem = async (id: string) => {
    if (window.confirm(t('setup.confirm_delete'))) {
      try {
        await deleteItem(id);
        setSelectedNode(null);
        setSelectedType(null);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };
  
  const handleSaveGroup = async () => {
    if (!groupCode || !groupEngName || !groupArName) {
      alert(t('setup.fill_all_fields'));
      return;
    }
    
    try {
      if (selectedNode && selectedType === 'group' && !isCreatingGroup) {
        const updatedGroup = await updateItemGroup({
          ...(selectedNode as ItemGroup),
          groupCode,
          groupEngName,
          groupArName,
          parentGroupId,
          vatPercentage: parseFloat(vatPercentage)
        });
        setSelectedNode(updatedGroup);
      } else {
        const newGroup = await addItemGroup({
          groupCode,
          groupEngName,
          groupArName,
          parentGroupId,
          vatPercentage: parseFloat(vatPercentage)
        });
        setSelectedNode(newGroup);
        setIsCreatingGroup(false);
      }
    } catch (error) {
      console.error('Error saving group:', error);
    }
  };
  
  const handleSaveItem = async () => {
    if (!itemCode || !itemEngName || !itemArName || !itemGroupId || !itemUom || itemPrice === '') {
      alert(t('setup.fill_all_fields'));
      return;
    }
    
    try {
      if (selectedNode && selectedType === 'item' && !isCreatingItem) {
        const updatedItem = await updateItem({
          ...(selectedNode as Item),
          itemCode,
          itemEngName,
          itemArName,
          groupId: itemGroupId,
          uom: itemUom,
          price: parseFloat(itemPrice)
        });
        setSelectedNode(updatedItem);
      } else {
        const newItem = await addItem({
          itemCode,
          itemEngName,
          itemArName,
          groupId: itemGroupId,
          uom: itemUom,
          price: parseFloat(itemPrice)
        });
        setSelectedNode(newItem);
        setIsCreatingItem(false);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };
  
  const toggleExpand = (id: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  
  const TreeView: React.FC<TreeViewProps> = ({ data, onSelectNode }) => {
    const renderTreeNode = (node, type: 'group' | 'item', level = 0) => {
      const isGroup = type === 'group';
      const hasChildren = isGroup && (node.children?.length > 0 || node.items?.length > 0);
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedNode?.id === node.id;
      
      return (
        <div key={node.id} className="select-none">
          <div 
            onClick={() => onSelectNode(node, type)}
            className={`flex items-center py-1 px-2 hover:bg-secondary cursor-pointer rounded ${isSelected ? 'bg-secondary' : ''}`}
            style={{ paddingLeft: `${(level + 1) * 12}px` }}
          >
            {hasChildren ? (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className="mr-1"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            ) : (
              <div className="w-5"></div>
            )}
            
            {isGroup ? (
              <FolderClosed className="h-4 w-4 mr-2" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            
            <span>{isGroup ? node.groupEngName : node.itemEngName}</span>
          </div>
          
          {isGroup && isExpanded && (
            <div>
              {node.children?.map((child: ItemGroup) => (
                renderTreeNode(child, 'group', level + 1)
              ))}
              
              {node.items?.map((item: Item) => (
                renderTreeNode(item, 'item', level + 1)
              ))}
            </div>
          )}
        </div>
      );
    };
    
    return (
      <div className="border rounded-lg p-2 h-[600px] overflow-auto">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Package className="h-12 w-12 mb-2" />
            <p>{t('setup.no_items_or_groups')}</p>
          </div>
        ) : (
          data.map(node => renderTreeNode(node, 'group'))
        )}
      </div>
    );
  };
  
  return (
    <SetupPageLayout
      title={t('setup.items')}
      description={t('setup.items_description')}
      headerTitle={t('setup.items')}
    >
      <div className="flex justify-end gap-2 mb-4">
        <Button 
          onClick={handleNewGroup} 
          variant="outline"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          {t('setup.new_group')}
        </Button>
        <Button 
          onClick={handleNewItem} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          {t('setup.new_item')}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <TreeView data={treeData} onSelectNode={handleSelectNode} />
        </div>
        
        <div className="lg:col-span-2">
          {selectedType === 'group' || isCreatingGroup ? (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">
                  {isCreatingGroup 
                    ? t('setup.new_group') 
                    : selectedNode 
                      ? t('setup.edit_group') 
                      : t('setup.group_details')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupCode">{t('setup.group_code')}</Label>
                    <Input 
                      id="groupCode"
                      value={groupCode} 
                      onChange={(e) => setGroupCode(e.target.value)} 
                      placeholder={t('setup.group_code')} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groupEngName">{t('setup.group_eng_name')}</Label>
                    <Input 
                      id="groupEngName"
                      value={groupEngName} 
                      onChange={(e) => setGroupEngName(e.target.value)} 
                      placeholder={t('setup.group_eng_name')} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groupArName">{t('setup.group_ar_name')}</Label>
                    <Input 
                      id="groupArName"
                      value={groupArName} 
                      onChange={(e) => setGroupArName(e.target.value)} 
                      placeholder={t('setup.group_ar_name')} 
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="parentGroup">{t('setup.parent_group')}</Label>
                    <Select 
                      value={parentGroupId || 'none'} 
                      onValueChange={(value) => setParentGroupId(value === 'none' ? null : value)}
                    >
                      <SelectTrigger id="parentGroup">
                        <SelectValue placeholder={t('setup.select_parent_group')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{t('setup.no_parent')}</SelectItem>
                        {itemGroups
                          .filter(g => g.id !== selectedNode?.id) // Prevent selecting self as parent
                          .map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              {group.groupEngName}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vatPercentage">{t('setup.vat_percentage')}</Label>
                    <Input 
                      id="vatPercentage"
                      type="number"
                      min="0"
                      step="0.01"
                      value={vatPercentage} 
                      onChange={(e) => setVatPercentage(e.target.value)} 
                      placeholder={t('setup.vat_percentage')} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  {selectedNode && !isCreatingGroup && (
                    <Button 
                      variant="destructive" 
                      onClick={() => deleteItemGroup(selectedNode.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash className="h-4 w-4" />
                      {t('setup.delete')}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleSaveGroup}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {t('setup.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : selectedType === 'item' || isCreatingItem ? (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">
                  {isCreatingItem 
                    ? t('setup.new_item') 
                    : selectedNode 
                      ? t('setup.edit_item') 
                      : t('setup.item_details')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemCode">{t('setup.item_code')}</Label>
                    <Input 
                      id="itemCode"
                      value={itemCode} 
                      onChange={(e) => setItemCode(e.target.value)} 
                      placeholder={t('setup.item_code')} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemEngName">{t('setup.item_eng_name')}</Label>
                    <Input 
                      id="itemEngName"
                      value={itemEngName} 
                      onChange={(e) => setItemEngName(e.target.value)} 
                      placeholder={t('setup.item_eng_name')} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemArName">{t('setup.item_ar_name')}</Label>
                    <Input 
                      id="itemArName"
                      value={itemArName} 
                      onChange={(e) => setItemArName(e.target.value)} 
                      placeholder={t('setup.item_ar_name')} 
                      dir="rtl"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemGroup">{t('setup.item_group')}</Label>
                    <Select 
                      value={itemGroupId} 
                      onValueChange={setItemGroupId}
                    >
                      <SelectTrigger id="itemGroup">
                        <SelectValue placeholder={t('setup.select_group')} />
                      </SelectTrigger>
                      <SelectContent>
                        {itemGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.groupEngName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemUom">{t('setup.uom')}</Label>
                    <Input 
                      id="itemUom"
                      value={itemUom} 
                      onChange={(e) => setItemUom(e.target.value)} 
                      placeholder={t('setup.uom')} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="itemPrice">{t('setup.price')}</Label>
                    <Input 
                      id="itemPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={itemPrice} 
                      onChange={(e) => setItemPrice(e.target.value)} 
                      placeholder={t('setup.price')} 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  {selectedNode && !isCreatingItem && (
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteItem(selectedNode.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash className="h-4 w-4" />
                      {t('setup.delete')}
                    </Button>
                  )}
                  
                  <Button 
                    onClick={handleSaveItem}
                    className="flex items-center gap-1"
                  >
                    <Save className="h-4 w-4" />
                    {t('setup.save')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-muted-foreground rounded-lg border">
              <Package className="h-16 w-16 mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('setup.select_or_create')}</h3>
              <p className="text-center max-w-md">
                {t('setup.select_from_tree_or_create')}
              </p>
            </div>
          )}
        </div>
      </div>
    </SetupPageLayout>
  );
};

export default ItemSetupPage;
