import { ChangeEventHandler } from "react"

import { StyledCheckbox } from "./Checkbox.styles"

type ValueType = number | readonly string[] | string | undefined

interface Props<TValue> {
  checked?: boolean
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  id?: string
  onChange?: ChangeEventHandler | undefined
  value?: TValue
}

export default function Checkbox<TValue extends ValueType>({
  checked,
  children,
  className,
  disabled,
  id,
  onChange,
  value
}: Props<TValue>) {
  return (
    <StyledCheckbox
      checked={checked}
      className={`${className} moj-checkbox govuk-!-display-inline-block`}
      disabled={disabled}
      id={id}
      onChange={onChange}
      value={value}
    >
      {children}
    </StyledCheckbox>
  )
}
