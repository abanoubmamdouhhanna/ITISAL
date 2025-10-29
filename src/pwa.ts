
import { registerSW } from 'virtual:pwa-register';
import { toast } from 'sonner';

export function setupPWA() {
  // Register service worker with immediate activation
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      toast.info(
        'New content available!', 
        {
          description: 'Click to update and reload the application',
          action: {
            label: 'Update',
            onClick: () => updateSW(true)
          },
          duration: 10000
        }
      );
    },
    onOfflineReady() {
      toast.success('App ready to work offline', {
        description: 'The app can now be used without an internet connection'
      });
    },
    onRegistered(registration) {
      console.log('Service worker registered successfully', registration);
      
      // Force an update check after registration
      if (registration) {
        registration.update().catch(console.error);
      }
    },
    onRegisterError(error) {
      console.error('Service worker registration error', error);
      toast.error('Failed to setup offline capabilities', {
        description: 'The app may not work properly offline'
      });
    }
  });

  // Periodically check for updates (every 60 minutes)
  setInterval(() => {
    updateSW(false);
  }, 60 * 60 * 1000);
}

// Check if the app can be installed
export function checkInstallability() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  // Check for iOS standalone mode using a type-safe approach
  const isIOSStandalone = () => {
    // @ts-ignore: navigator.standalone is not in the TypeScript definition but exists in Safari
    return typeof navigator !== 'undefined' && navigator.standalone === true;
  };
  
  // If already installed or iOS Safari (which doesn't support the install event)
  if (isStandalone || isIOSStandalone()) {
    console.log('App is already installed');
    return false;
  }
  
  return true;
}
