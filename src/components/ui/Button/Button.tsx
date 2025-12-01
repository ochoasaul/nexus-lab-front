import type { ButtonHTMLAttributes } from 'react'
import type React from 'react'
import { useMemo } from 'react'
import { useButton } from './useButton'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string
  variant?: ButtonVariant
  isLoadingText?: string
  loading?: boolean
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-60 disabled:cursor-not-allowed'

const variantMap: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white shadow-glow hover:bg-primary-500',
  secondary: 'bg-white text-charcoal-900 hover:bg-charcoal-50 border border-charcoal-100',
  ghost: 'border border-charcoal-200 text-charcoal-900 hover:border-primary-400 hover:text-primary-600',
}

function Button({
  label,
  onClick,
  variant = 'primary',
  className = '',
  isLoadingText = 'Procesando…',
  loading,
  Icon,
  ...rest
}: ButtonProps) {
  const { isLoading, handleClick } = useButton(onClick)

  const styles = useMemo(() => `${baseClasses} ${variantMap[variant]} ${className}`.trim(), [className, variant])
  const isBusy = loading ?? isLoading
  const clickHandler = onClick ? handleClick : undefined

  return (
    <button className={styles} onClick={clickHandler} disabled={isBusy} {...rest}>
      {isBusy ? (
        isLoadingText
      ) : (
        <>
          {Icon ? (
            <Icon className="w-4 h-4 text-current" aria-hidden="true" />
          ) : null}
          <span>{label}</span>
        </>
      )}
    </button>
  )
}

export default Button
