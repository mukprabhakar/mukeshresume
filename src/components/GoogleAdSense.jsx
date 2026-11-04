import React, { useEffect } from 'react'

const GoogleAdSense = ({ adSlot, adFormat = 'auto', adLayout = '', adLayoutKey = '', style = {} }) => {
  useEffect(() => {
    // Dynamically load AdSense client script only when Ad components are rendered
    const scriptId = 'adsense-script'
    let script = document.getElementById(scriptId)
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.async = true;
      const pubId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || 'ca-pub-2173205610919684'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`
      script.crossOrigin = 'anonymous'
      document.head.appendChild(script)
    }

    // Push ad unit configuration to the queue
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div className="my-8" style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={import.meta.env.VITE_ADSENSE_PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout-key={adLayoutKey}
        data-ad-layout={adLayout}
        data-full-width-responsive="true"
      />
    </div>
  )
}

export default GoogleAdSense
