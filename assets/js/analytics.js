(function () {
  const analyticsConfig = window.siteConfig && window.siteConfig.analytics;

  if (!analyticsConfig || !analyticsConfig.enabled || !analyticsConfig.scriptSrc || !analyticsConfig.domain) {
    return;
  }

  if (document.querySelector('script[data-analytics-provider]')) {
    return;
  }

  const analyticsScript = document.createElement('script');

  // Privacy-friendly analytics shared across all static pages.
  analyticsScript.defer = true;
  analyticsScript.src = analyticsConfig.scriptSrc;
  analyticsScript.setAttribute('data-domain', analyticsConfig.domain);
  analyticsScript.setAttribute('data-analytics-provider', analyticsConfig.provider || 'analytics');

  document.head.appendChild(analyticsScript);
})();
