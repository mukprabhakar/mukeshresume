/* Pointer-tracking spotlight for cards.
   Sets --spot-x / --spot-y on the element so CSS can paint a soft brand-red
   glow that follows the cursor. No state, no re-renders – just CSS variables. */

export const useSpotlight = () => {
  const onMouseMove = (event) => {
    const el = event.currentTarget
    if (!el || !el.style || !el.style.setProperty) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
    el.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
  }

  const onMouseLeave = (event) => {
    const el = event.currentTarget
    if (!el || !el.style || !el.style.setProperty) return
    /* park the glow off-canvas so it fades out cleanly */
    el.style.setProperty('--spot-x', '-9999px')
    el.style.setProperty('--spot-y', '-9999px')
  }

  return { onMouseMove, onMouseLeave }
}

export default useSpotlight
