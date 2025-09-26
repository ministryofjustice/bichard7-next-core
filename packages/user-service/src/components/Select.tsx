export type Option = {
  name: string
  id: number | string
}

interface Props {
  options?: Option[]
  label: string
  id: string
  defaultValue?: number | string
}

const Select = ({ options, label, id, defaultValue }: Props) => (
  <div className="govuk-form-group">
    <label className="govuk-label govuk-!-padding-top-2" htmlFor={id}>
      {label}
    </label>
    <select className="govuk-select" id={id} name={id}>
      {options &&
        options.map((option: Option) => (
          <option selected={String(option.id) === String(defaultValue)} key={option.name} value={option.id}>
            {option.name}
          </option>
        ))}
    </select>
  </div>
)

export default Select
