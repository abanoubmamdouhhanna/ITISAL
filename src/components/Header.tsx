
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Plus, LayoutDashboard, LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { logout } from '@/lib/auth';
import { toast } from 'sonner';
import SetupMenu from '@/components/SetupMenu';
import { useTheme } from 'next-themes';
import { useStore } from '@/context/StoreContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showNewOrderButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showNewOrderButton = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, isRTL, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { brands } = useStore();
  
  const brand = brands[0];
  const brandName = brand ? (language === 'ar' ? brand.brandArName : brand.brandEngName) : title;
  const brandImage = brand?.brandImage || './Etsal.jpg';

  const handleBack = () => {
    navigate(-1);
  };

  const handleNewOrder = () => {
    navigate('/new-order');
  };

  const handleDashboard = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b px-2 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 min-w-0 flex-1">
          {showBackButton && (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-secondary transition-all duration-200 h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
            >
              <ChevronLeft className={cn("h-4 w-4 sm:h-5 sm:w-5", isRTL && "rotate-180")} />
              <span className="sr-only">{t('app.back')}</span>
            </Button>
          )}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <img
              src={brandImage}
              alt={brandName}
              className="h-6 sm:h-8 w-auto flex-shrink-0"
            />
            <h1 className={cn(
              "text-sm sm:text-lg md:text-xl font-semibold truncate",
              showBackButton && "ml-0"
            )}>
              {brandName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <SetupMenu />

          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 sm:h-9 sm:w-9"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <LanguageSwitcher />

          {location.pathname !== '/' && (
            <Button
              onClick={handleDashboard}
              variant="outline"
              size="sm"
              className="gap-1 h-8 sm:h-9"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden md:inline">{t('app.dashboard')}</span>
            </Button>
          )}

          {showNewOrderButton && (
            <Button
              onClick={handleNewOrder}
              className="gap-1 h-8 sm:h-9"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden md:inline">{t('app.new_order')}</span>
            </Button>
          )}

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-1 h-8 sm:h-9"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">{t('app.logout')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
