import { ReactNode } from "react"

interface Props {
  value: string
  id: string
  name: string
  text: string
  defaultChecked?: boolean
}

export const RadioItem = ({ value, id, name, text, defaultChecked }: Props): ReactNode => {
  return (
    <div className="govuk-radios__item">
      <input
        className="govuk-radios__input"
        id={id}
        name={name}
        type="radio"
        value={value}
        defaultChecked={defaultChecked}
      />
      <label className="govuk-label govuk-radios__label" htmlFor={id}>
        {text}
      </label>
    </div>
  )
}
