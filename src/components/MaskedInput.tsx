'use client'

import React, { forwardRef } from 'react'
import InputMask from 'react-input-mask-next'

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, className, ...rest }, ref) => {
    return (
      <InputMask mask={mask} {...rest}>
        {(inputProps) => (
          <input
            {...inputProps}
            ref={ref}
            className={className}
            placeholder={rest.placeholder}
            disabled={rest.disabled}
          />
        )}
      </InputMask>
    )
  }
)

MaskedInput.displayName = 'MaskedInput'
export default MaskedInput
