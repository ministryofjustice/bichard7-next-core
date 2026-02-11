import type { ChangeEvent } from "react"

interface Props {
  label: string
  name?: string
  checked: boolean
  id?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: React.FC<Props> = ({ label, name, checked, id, onChange, ...props }: Props) => {
  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <label className="govuk-checkboxes__label" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}

export default Checkbox
