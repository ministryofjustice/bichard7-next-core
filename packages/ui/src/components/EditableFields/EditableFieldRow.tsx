import { LabelCell } from "./EditableFieldRow.styles"
import InitialValueAndCorrectionField from "./InitialValueAndCorrectionField"
import InputField from "./InputField"
import LabelField from "./LabelField"

type Props = {
  className?: string
  label: string
  hasExceptions: boolean
  value?: string | React.ReactNode
  updatedValue?: string | null
  isEditable: boolean
  children?: React.ReactNode
  inputLabel: string
  hintText: string
  htmlFor: string
}

const EditableFieldRow = ({
  className,
  value,
  updatedValue,
  label,
  hasExceptions,
  isEditable,
  inputLabel,
  hintText,
  children,
  htmlFor
}: Props) => {
  const isRendered = !!(value || updatedValue || hasExceptions)
  const hasCorrection = updatedValue && value !== updatedValue

  if (!isRendered) {
    return
  }

  const fieldToRender = (): React.ReactNode => {
    if (isEditable) {
      return (
        <InputField value={value} inputLabel={inputLabel} hintText={hintText} htmlFor={htmlFor}>
          {children}
        </InputField>
      )
    } else if (hasCorrection) {
      return <InitialValueAndCorrectionField value={value} updatedValue={updatedValue} />
    } else {
      return value
    }
  }

  return (
    <div className={`govuk-summary-list__row ${className}`}>
      <LabelCell className={"govuk-summary-list__key"}>
        <LabelField label={label} showErrorIcon={hasExceptions} />
      </LabelCell>
      <dd className="govuk-summary-list__value">{fieldToRender()}</dd>
    </div>
  )
}

export default EditableFieldRow
