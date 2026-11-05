import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/* Renders an overlay into document.body.

   Why this is needed: any ancestor that keeps a `transform` after its entrance
   animation (framer-motion <Reveal> wrappers, .animate-fade-in) becomes the
   containing block for `position: fixed` descendants, which flings modals,
   lightboxes and banners far off screen. Portalling sidesteps every ancestor.

   Keep <Portal> mounted and put <AnimatePresence> *inside* it, so exit
   animations still play. */

const Portal = ({ children }) => {
  const [container, setContainer] = useState(null)

  useEffect(() => {
    const node = document.createElement('div')
    node.setAttribute('data-overlay-portal', '')
    document.body.appendChild(node)
    setContainer(node)
    return () => {
      document.body.removeChild(node)
      setContainer(null)
    }
  }, [])

  if (!container) return null
  return createPortal(children, container)
}

export default Portal
