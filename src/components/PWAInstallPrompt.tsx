
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { checkInstallability } from '@/pwa';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Check if app is already installed
    const canInstall = checkInstallability();
    if (!canInstall) {
      return;
    }
    
    // Check if user has previously dismissed the prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed && new Date().getTime() - parseInt(dismissed) < 24 * 60 * 60 * 1000) {
      setIsDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      console.log('Install prompt captured and ready');
    };
    
    window.addEventListener('beforeinstallprompt', handler);

    // For iOS Safari which doesn't support beforeinstallprompt
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS && !window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(true);
      console.log('iOS device detected, showing install prompt');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    // For browsers that support the install prompt
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('User accepted the install prompt');
          toast.success(t('app.install_success') || 'App installed successfully!');
        } else {
          console.log('User dismissed the install prompt');
          // Store dismissal timestamp
          localStorage.setItem('pwa-install-dismissed', new Date().getTime().toString());
        }
      } catch (error) {
        console.error('Error with installation', error);
        toast.error(t('app.install_error') || 'Installation failed');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } 
    // Special case for iOS
    else if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      toast.info(
        t('app.ios_install_title') || 'Install this app', 
        { 
          description: t('app.ios_install_instruction') || 'Tap "Share" then "Add to Home Screen"',
          duration: 8000
        }
      );
    }
  };
  
  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', new Date().getTime().toString());
  };

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-primary/10 p-2 rounded-lg shadow-sm">
      <Button 
        onClick={handleInstallClick} 
        variant="default" 
        size="sm" 
        className="gap-1 whitespace-nowrap"
      >
        {isMobile ? 
          <Download className="h-4 w-4" /> :
          <Share2 className="h-4 w-4" />
        }
        <span>{t('app.install_app') || 'Install App'}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDismiss}
        className="p-1 h-6 w-6 rounded-full"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PWAInstallPrompt;
