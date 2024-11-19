import type { ChangeEvent } from "react"

interface Props {
  checked?: boolean
  dataAriaControls?: string
  defaultChecked?: boolean
  id: string
  label: string
  name: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  value?: string
}

const RadioButton: React.FC<Props> = ({
  checked,
  dataAriaControls,
  defaultChecked,
  id,
  label,
  name,
  onChange,
  value
}: Props) => {
  return (
    <div className="govuk-radios__item">
      <input
        checked={checked}
        className="govuk-radios__input"
        data-aria-controls={dataAriaControls}
        defaultChecked={defaultChecked}
        id={id}
        name={name}
        onChange={onChange}
        type="radio"
        value={value}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default RadioButton
