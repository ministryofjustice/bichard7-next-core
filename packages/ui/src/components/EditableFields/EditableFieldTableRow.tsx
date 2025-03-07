import Asn from "services/Asn"
import { LabelCell } from "./EditableFieldTableRow.styles"
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

const EditableFieldTableRow = ({
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
  const hasCorrection = updatedValue && value !== Asn.divideAsn(updatedValue)

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
    <tr className={`govuk-table__row ${className}`}>
      <LabelCell className={"govuk-table__header govuk-body-s"}>
        <LabelField label={label} showErrorIcon={hasExceptions} />
      </LabelCell>
      <td className="govuk-table__cell">{fieldToRender()}</td>
    </tr>
  )
}

export default EditableFieldTableRow
