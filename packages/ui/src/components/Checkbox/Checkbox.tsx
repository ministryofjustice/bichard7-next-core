import { useId, type ChangeEvent } from "react"

interface Props {
  label: string
  name?: string
  checked: boolean
  id?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: React.FC<Props> = ({ label, name, checked, id, onChange, ...props }: Props) => {
  const defaultId = useId()
  const idToUse = id ?? defaultId

  return (
    <div className="govuk-checkboxes__item">
      <input
        className="govuk-checkboxes__input"
        id={idToUse}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        {...props}
      />
      <label className="govuk-checkboxes__label" htmlFor={idToUse}>
        {label}
      </label>
    </div>
  )
}

export default Checkbox
