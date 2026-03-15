/**
 * Analytics Utility
 * 
 * Provides a simple interface for tracking custom events via Umami.
 */

interface Umami {
  track: (eventName: string, data?: any) => void;
}

declare global {
  interface Window {
    umami?: Umami;
  }
}

export const analytics = {
  /**
   * Track a custom event
   * @param eventName Name of the event to track
   * @param data Optional metadata
   */
  track: (eventName: string, data?: any) => {
    if (window.umami) {
      window.umami.track(eventName, data);
    } else {
      // Fallback for development/offline
      if (import.meta.env.DEV) {
        console.log(`[Analytics] Track Event: ${eventName}`, data || '');
      }
    }
  }
};
