import React from 'react'

/**
 * Minimal ERP-style button. Renders as <button>, <a> (href), or any element
 * via `as`. Variant + size classes mirror the reference design tokens.
 */
const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200 cursor-pointer select-none disabled:pointer-events-none disabled:opacity-50'

const variants = {
  brand: 'bg-brand text-white shadow-sm hover:bg-brand-dark hover:shadow-md hover:-translate-y-0.5 active:translate-y-0',
  dark: 'bg-ink text-white hover:bg-ink-soft hover:-translate-y-0.5 active:translate-y-0',
  outline: 'border border-line bg-white text-ink hover:border-brand hover:text-brand hover:-translate-y-0.5',
  outlineInvert: 'border border-white/25 bg-transparent text-white hover:border-brand hover:bg-brand hover:-translate-y-0.5',
  ghost: 'text-ink hover:bg-surface hover:text-brand',
  soft: 'bg-brand-soft text-brand hover:bg-brand hover:text-white',
}

const sizes = {
  sm: 'h-9 px-4 text-xs',
  md: 'h-11 px-6 text-sm',
  lg: 'h-13 px-8 text-base',
  icon: 'h-10 w-10',
}

export function buttonStyles(variant = 'brand', size = 'md', className = '') {
  return `${base} ${variants[variant] || variants.brand} ${sizes[size] || sizes.md} ${className}`.trim()
}

export default function Button({
  variant = 'brand',
  size = 'md',
  className = '',
  href,
  as,
  children,
  ...props
}) {
  const classes = buttonStyles(variant, size, className)
  const Component = as || (href ? 'a' : 'button')
  return (
    <Component className={classes} href={href} {...props}>
      {children}
    </Component>
  )
}
