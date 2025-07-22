/**
 * Mobile viewport height fix for Chrome device mode and mobile browsers
 * This helps ensure that 100vh works correctly on mobile devices
 * and handles iOS safe areas properly
 */

export function setupMobileViewportFix() {
  // First we get the viewport height and multiply it by 1% to get a value for a vh unit
  const vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  // We listen to the resize event
  window.addEventListener('resize', () => {
    // We execute the same script as before
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update safe area insets
    updateSafeAreaInsets();
    
    // Force reflow/redraw to apply changes immediately
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';
  });

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    // Wait a bit for the browser to adjust
    setTimeout(() => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Update safe area insets after orientation change
      updateSafeAreaInsets();
      
      // Force reflow/redraw to apply changes immediately
      document.body.style.display = 'none';
      document.body.offsetHeight; // Force reflow
      document.body.style.display = '';
    }, 300); // Increased timeout for better reliability
  });
  
  // Initial call to set safe area insets
  updateSafeAreaInsets();
}

/**
 * Updates CSS variables for safe area insets to handle notches and home indicators on iOS
 */
function updateSafeAreaInsets() {
  // Check if the environment supports env() CSS function (iOS 11+)
  const isSafeAreaSupported = CSS.supports('padding-bottom: env(safe-area-inset-bottom)');
  
  if (isSafeAreaSupported) {
    // Set fallback values in case env() isn't available yet
    const root = document.documentElement;
    root.style.setProperty('--safe-area-inset-top', '0px');
    root.style.setProperty('--safe-area-inset-right', '0px');
    root.style.setProperty('--safe-area-inset-bottom', '30px'); // Increased default fallback for better spacing
    root.style.setProperty('--safe-area-inset-left', '0px');
    
    // Use a timeout to allow env() values to be properly computed
    setTimeout(() => {
      // Create a test element to extract the env() values
      const testEl = document.createElement('div');
      testEl.style.paddingTop = 'env(safe-area-inset-top)';
      testEl.style.paddingRight = 'env(safe-area-inset-right)';
      testEl.style.paddingBottom = 'env(safe-area-inset-bottom)';
      testEl.style.paddingLeft = 'env(safe-area-inset-left)';
      testEl.style.position = 'fixed';
      testEl.style.visibility = 'hidden';
      document.body.appendChild(testEl);
      
      const style = getComputedStyle(testEl);
      
      // Extract values and set CSS variables
      const topInset = style.paddingTop || '0px';
      const rightInset = style.paddingRight || '0px';
      const bottomInset = style.paddingBottom || '30px'; // Use increased fallback
      const leftInset = style.paddingLeft || '0px';
      
      root.style.setProperty('--safe-area-inset-top', topInset);
      root.style.setProperty('--safe-area-inset-right', rightInset);
      root.style.setProperty('--safe-area-inset-bottom', bottomInset);
      root.style.setProperty('--safe-area-inset-left', leftInset);
      
      document.body.removeChild(testEl);
      
      // For landscape orientation on notched devices, ensure we have enough side padding
      if (window.innerWidth > window.innerHeight) { // landscape
        // Check if device is potentially notched (e.g. iPhone X and newer)
        if (topInset !== '0px' || leftInset !== '0px' || rightInset !== '0px') {
          if (parseFloat(leftInset) < 20) {
            root.style.setProperty('--safe-area-inset-left', '20px');
          }
          if (parseFloat(rightInset) < 20) {
            root.style.setProperty('--safe-area-inset-right', '20px');
          }
        }
      }
    }, 100);
  }
}
