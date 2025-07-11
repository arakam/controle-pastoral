'use client'

import React, { forwardRef } from 'react'
import InputMask from 'react-input-mask-next'

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, className, placeholder, disabled, ...rest }, ref) => {
    return (
      <InputMask
        mask={mask}
        {...rest}
        disabled={disabled}
      >
        <input
          ref={ref}
          className={className}
          placeholder={placeholder}
        />
      </InputMask>
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
export default MaskedInput
