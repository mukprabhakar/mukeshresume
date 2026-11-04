import React, { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const savedConsent = localStorage.getItem('cookieConsent')
    if (!savedConsent) {
      // Delay showing the banner slightly for a smoother entry feel
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const updateConsentMode = (analyticsGranted, marketingGranted) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: analyticsGranted ? 'granted' : 'denied',
        ad_storage: marketingGranted ? 'granted' : 'denied',
        ad_user_data: marketingGranted ? 'granted' : 'denied',
        ad_ad_personalization: marketingGranted ? 'granted' : 'denied',
      })
    }
  }

  const handleAcceptAll = () => {
    const consent = { analytics: true, marketing: true }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    updateConsentMode(true, true)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const consent = { analytics: false, marketing: false }
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    updateConsentMode(false, false)
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences))
    updateConsentMode(preferences.analytics, preferences.marketing)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-slide-in-up"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
    >
      <div className="glass-effect rounded-2xl p-6 border border-zinc-700/50 shadow-2xl">
        {!showCustomize ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl" role="img" aria-label="Cookie">🍪</span>
              <h2 id="cookie-consent-title" className="text-lg font-semibold text-emerald-400">
                Cookie Consent
              </h2>
            </div>
            
            <p id="cookie-consent-description" className="text-sm text-zinc-300 leading-relaxed mb-5">
              We use cookies to enhance your browsing experience, analyze site traffic, and deliver personalized content. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies. Read our privacy preferences for details.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <button
                onClick={() => setShowCustomize(true)}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors rounded-lg hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Customize
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700/80 rounded-lg border border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-lg shadow-lg hover:shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 id="cookie-consent-title" className="text-md font-semibold text-emerald-400">
                Privacy Preferences
              </h2>
              <button 
                onClick={() => setShowCustomize(false)}
                className="text-zinc-400 hover:text-zinc-100 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Back to overview"
              >
                Back
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {/* Essential Cookies */}
              <div className="flex items-start justify-between gap-4 p-2 rounded-lg hover:bg-zinc-800/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-200">Strictly Necessary</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-400 rounded">Always Active</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Required for the site to function properly (e.g., security, consent storage).
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 p-2 rounded-lg hover:bg-zinc-800/30 transition-colors">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-zinc-200">Analytics Cookies</span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Helps us understand how visitors interact with the site, detecting traffic sources and page performance.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between gap-4 p-2 rounded-lg hover:bg-zinc-800/30 transition-colors">
                <div className="flex-1">
                  <span className="text-xs font-semibold text-zinc-200">Marketing & Personalization</span>
                  <p className="text-xs text-zinc-400 mt-1">
                    Used to track visitor behavior across websites to allow relevant ads and personalized content.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleSavePreferences}
                className="w-full px-4 py-2.5 text-xs font-semibold text-zinc-950 bg-emerald-400 hover:bg-emerald-300 transition-colors rounded-lg shadow-lg hover:shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
