/**
 * Google Analytics utility functions
 * 
 * This file contains helper functions for tracking events in Google Analytics
 * using the gtag function that should be available globally after the GA script loads.
 */

/**
 * Track a custom event in Google Analytics
 * @param {string} action - The action that occurred (e.g., 'click', 'submit')
 * @param {string} category - The category of the event (e.g., 'button', 'form')
 * @param {string} label - A label for the event (e.g., 'contact form submit')
 * @param {number} value - A numeric value associated with the event (optional)
 */
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Track page views in Google Analytics
 * @param {string} path - The path of the page being viewed
 * @param {string} title - The title of the page being viewed
 */
export const trackPageView = (path, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID || 'GA_MEASUREMENT_ID', {
      page_path: path,
      page_title: title,
    });
  }
};

/**
 * Track social interactions in Google Analytics
 * @param {string} network - The social network (e.g., 'twitter', 'linkedin')
 * @param {string} action - The action taken (e.g., 'share', 'like')
 * @param {string} target - The target of the action (e.g., URL)
 */
export const trackSocial = (network, action, target) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: 'social',
      event_label: `${network}:${target}`,
    });
  }
};

export default {
  trackEvent,
  trackPageView,
  trackSocial,
};