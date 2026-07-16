import { useEffect } from 'react';
import { useSettingByKey } from '@/hooks/useSettings';

export function TawkToWidget() {
  const enabled = useSettingByKey('tawk_enabled');
  const propertyId = useSettingByKey('tawk_property_id');
  const widgetId = useSettingByKey('tawk_widget_id');

  useEffect(() => {
    const win = window as any;

    if (enabled !== 'true' || !propertyId || !widgetId) {
      // Clean up script and containers if disabled or IDs removed
      const existingScript = document.getElementById('tawk-script');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Tawk.to dynamically creates widget elements
      const tawkContainers = document.querySelectorAll('[class^="tawk-"], [id^="tawk-"], iframe[title*="tawk.to"]');
      tawkContainers.forEach(el => el.remove());

      if (win.Tawk_API) {
        try {
          win.Tawk_API.hideWidget();
        } catch (e) {}
        delete win.Tawk_API;
      }
      return;
    }

    // Check if script is already injected
    if (document.getElementById('tawk-script')) {
      return;
    }

    // Setup Tawk.to configuration
    win.Tawk_API = win.Tawk_API || {};
    win.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.id = 'tawk-script';
    s1.async = true;
    s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    
    const s0 = document.getElementsByTagName("script")[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }

    return () => {
      // Clean up on component unmount
      const existingScript = document.getElementById('tawk-script');
      if (existingScript) {
        existingScript.remove();
      }

      if (win.Tawk_API) {
        try {
          win.Tawk_API.hideWidget();
        } catch (e) {}
      }

      // Remove widget DOM elements completely
      const tawkContainers = document.querySelectorAll('[class^="tawk-"], [id^="tawk-"], iframe[title*="tawk.to"]');
      tawkContainers.forEach(el => el.remove());
    };
  }, [enabled, propertyId, widgetId]);

  return null;
}
