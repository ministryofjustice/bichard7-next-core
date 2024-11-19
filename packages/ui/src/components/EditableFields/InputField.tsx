import { HintText, Label } from "govuk-react"

import { InitialInputValueBadge } from "./Badges"
import { StyledInputField } from "./InputField.styles"

interface EditableInputFieldProps {
  children?: React.ReactNode
  hintText: string
  inputLabel: string
  value?: React.ReactNode | string
}

const InputField: React.FC<EditableInputFieldProps> = ({ children, hintText, inputLabel, value }) => {
  return (
    <StyledInputField>
      {value}
      <InitialInputValueBadge />
      <br />
      <Label className="govuk-label">
        {inputLabel}
        {hintText &&
          hintText.split("\\n").map((hint, key) => {
            return <HintText key={key}>{hint}</HintText>
          })}
        {children}
      </Label>
    </StyledInputField>
  )
}

export default InputField
