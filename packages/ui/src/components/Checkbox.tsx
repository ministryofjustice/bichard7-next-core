import { ChangeEventHandler } from "react"
import { StyledCheckbox } from "./Checkbox.styles"

type ValueType = string | number | readonly string[] | undefined

interface Props<TValue> {
  id?: string
  children?: React.ReactNode
  className?: string
  value?: TValue
  checked?: boolean
  disabled?: boolean
  onChange?: ChangeEventHandler | undefined
}

export default function Checkbox<TValue extends ValueType>({
  id,
  children,
  className,
  value,
  checked,
  disabled,
  onChange
}: Props<TValue>) {
  return (
    <StyledCheckbox
      id={id}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`${className} moj-checkbox govuk-!-display-inline-block`}
    >
      {children}
    </StyledCheckbox>
  )
}
