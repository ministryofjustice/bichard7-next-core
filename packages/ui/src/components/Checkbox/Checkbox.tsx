import React, { useId, ComponentProps } from "react"

interface Props extends ComponentProps<"input"> {
  label: string
}

const Checkbox: React.FC<Props> = (props: Props) => {
  const { id, label } = props
  const defaultId = useId()
  const idToUse = id ?? defaultId

  return (
    <div className="govuk-checkboxes__item">
      <input className="govuk-checkboxes__input" id={idToUse} type="checkbox" {...props} />
      <label className="govuk-checkboxes__label" htmlFor={idToUse}>
        {label}
      </label>
    </div>
  )
}

export default Checkbox
