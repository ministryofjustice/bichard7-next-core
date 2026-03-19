import { useId, type ChangeEvent, forwardRef } from "react"

interface Props {
  label: string
  name?: string
  checked?: boolean
  id?: string
  defaultChecked?: boolean
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { id, label } = props
  const defaultId = useId()
  const idToUse = id ?? defaultId

  return (
    <div className="govuk-checkboxes__item">
      <input className="govuk-checkboxes__input" id={idToUse} type="checkbox" ref={ref} {...props} />
      <label className="govuk-checkboxes__label" htmlFor={idToUse}>
        {label}
      </label>
    </div>
  )
})

Checkbox.displayName = "Checkbox"

export default Checkbox
