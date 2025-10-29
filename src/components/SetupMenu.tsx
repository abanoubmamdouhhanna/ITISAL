
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Store, MapPin, Link, PackageOpen, Users, ShieldAlert, Languages, Tag } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';
import { useStore } from '@/context/StoreContext';

const SetupMenu = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { systemUsers, userPermissions, checkPermission } = useStore();
  
  // Get the current logged-in user (placeholder - in a real app, this would come from auth)
  const currentUser = systemUsers[0]; // For demo purposes
  
  const handleNavigate = (path: string, permission?: string) => {
    // If no user yet (initial setup) or user has permission, allow navigation
    if (!currentUser || !permission || checkPermission(permission as any, currentUser.id)) {
      navigate(path);
    } else {
      // User does not have permission
      alert(t('setup.noPermission'));
    }
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-background">
            <Settings className="h-4 w-4 mr-2" />
            {t('setup.title')}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="flex flex-col w-[320px] sm:w-[360px] md:w-[400px] gap-2 p-4">
              <ListItem
                title={t('setup.stores')}
                icon={<Store className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/stores', 'allowStoreSetup')}
              >
                {t('setup.storesDescription')}
              </ListItem>
              <ListItem
                title={t('setup.brands')}
                icon={<Tag className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/brands', 'allowStoreSetup')}
              >
                {t('setup.brandsDescription')}
              </ListItem>
              <ListItem
                title={t('setup.regions')}
                icon={<MapPin className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/regions', 'allowRegionSetup')}
              >
                {t('setup.regionsDescription')}
              </ListItem>
              <ListItem
                title={t('setup.storeRegions')}
                icon={<Link className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/store-regions', 'allowRegionSetup')}
              >
                {t('setup.storeRegionsDescription')}
              </ListItem>
              <ListItem
                title={t('setup.items')}
                icon={<PackageOpen className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/items', 'allowItemGroupsSetup')}
              >
                {t('setup.itemGroupsSetupDesc')}
              </ListItem>
              <ListItem
                title={t('setup.users')}
                icon={<Users className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/users', 'allowUserSetup')}
              >
                {t('setup.usersDescription')}
              </ListItem>
              <ListItem
                title={t('setup.security')}
                icon={<ShieldAlert className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/security', 'allowUserSetup')}
              >
                {t('setup.securityDescription')}
              </ListItem>
              <ListItem
                title={t('setup.languageSetup')}
                icon={<Languages className="h-4 w-4 mr-2" />}
                onClick={() => handleNavigate('/setup/language')}
              >
                {t('setup.languageSetupDesc')}
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center">
            {icon && <span className="mr-2">{icon}</span>}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default SetupMenu;
