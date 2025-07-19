// Function to register the service worker for PWA
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: './' });
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Function to check if the app can be installed
export const isPwaInstallable = (): boolean => {
  return window.matchMedia('(display-mode: browser)').matches && 
         !window.matchMedia('(display-mode: standalone)').matches && 
         !window.matchMedia('(display-mode: minimal-ui)').matches &&
         (window.navigator as any).standalone !== true;
};

// Function to check if the app is already installed
export const isPwaInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.matchMedia('(display-mode: minimal-ui)').matches ||
         (window.navigator as any).standalone === true;
};
