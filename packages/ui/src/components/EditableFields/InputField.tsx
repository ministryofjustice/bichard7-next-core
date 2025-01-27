import { HintText } from "components/HintText"
import { InitialInputValueBadge } from "./Badges"
import { StyledInputField } from "./InputField.styles"

interface EditableInputFieldProps {
  value?: string | React.ReactNode
  children?: React.ReactNode
  inputLabel: string
  hintText: string
}

const InputField: React.FC<EditableInputFieldProps> = ({ value, inputLabel, hintText, children }) => {
  return (
    <StyledInputField>
      {value}
      <InitialInputValueBadge />
      <br />
      <label className={`govuk-label`}>
        {inputLabel}
        {hintText &&
          hintText.split("\\n").map((hint) => {
            return (
              <HintText className={"govuk-body-s"} key={hint}>
                {hint}
              </HintText>
            )
          })}
        {children}
      </label>
    </StyledInputField>
  )
}

export default InputField
