import type { ChangeEvent } from "react"

interface Props {
  name: string
  id: string
  dataAriaControls?: string
  defaultChecked?: boolean
  checked?: boolean
  value?: string
  label: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const RadioButton: React.FC<Props> = ({
  name,
  id,
  dataAriaControls,
  defaultChecked,
  checked,
  value,
  label,
  onChange
}: Props) => {
  return (
    <div className="govuk-radios__item">
      <input
        className="govuk-radios__input"
        name={name}
        id={id}
        type="radio"
        data-aria-controls={dataAriaControls}
        value={value}
        defaultChecked={defaultChecked}
        checked={checked}
        onChange={onChange}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioButton
