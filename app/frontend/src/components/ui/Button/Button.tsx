import { cva, VariantProps } from 'class-variance-authority'
import React, { ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

const buttonStyles = cva(
  'rounded-md px-3 py-2  text-xl shadow-md shadow-gray-400/40 border-white border-[1.5px] transition-all duration-200 font-thin' +
    ' disabled:bg-neutral-600 disabled:shadow-none disabled:hover:text-neutral-100 active:brightness-90 active:shadow-none',
  {
    variants: {
      intent: {
        primary: 'bg-white text-black hover:brightness-150',
        secondary: 'bg-black text-white hover:brightness-150',
        danger: 'bg-red-600 text-white hover:brightness-110',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      intent: 'primary',
    },
  }
)

export interface IButton extends React.ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonStyles> {
  children: ReactElement | string
  intent?: 'primary' | 'secondary' | 'danger'
  fullWidth?: boolean
}

const Button = ({ children, intent, fullWidth, ...rest }: IButton) => {
  return (
    <button
      {...rest}
      className={twMerge(
        buttonStyles({
          intent,
          fullWidth,
        })
      )}
    >
      {children}
    </button>
  )
}

export { Button }
