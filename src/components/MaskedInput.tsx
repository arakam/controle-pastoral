'use client'

import InputMask from 'react-input-mask'

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string
}

export default function MaskedInput({ mask, ...props }: MaskedInputProps) {
  return (
    <InputMask mask={mask} {...props}>
      {(inputProps: any) => <input {...inputProps} />}
    </InputMask>
  )
}
