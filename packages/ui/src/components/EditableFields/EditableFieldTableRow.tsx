import { Table } from "govuk-react"

import { LabelCell } from "./EditableFieldTableRow.styles"
import InitialValueAndCorrectionField from "./InitialValueAndCorrectionField"
import InputField from "./InputField"
import LabelField from "./LabelField"

type Props = {
  children?: React.ReactNode
  className?: string
  hasExceptions: boolean
  hintText: string
  inputLabel: string
  isEditable: boolean
  label: string
  updatedValue?: null | string
  value?: React.ReactNode | string
}

const EditableFieldTableRow = ({
  children,
  className,
  hasExceptions,
  hintText,
  inputLabel,
  isEditable,
  label,
  updatedValue,
  value
}: Props) => {
  const isRendered = !!(value || updatedValue || hasExceptions)
  const hasCorrection = updatedValue && value !== updatedValue

  if (!isRendered) {
    return
  }

  const fieldToRender = (): React.ReactNode => {
    if (isEditable) {
      return (
        <InputField hintText={hintText} inputLabel={inputLabel} value={value}>
          {children}
        </InputField>
      )
    } else if (hasCorrection) {
      return <InitialValueAndCorrectionField updatedValue={updatedValue} value={value} />
    } else {
      return value
    }
  }

  return (
    <Table.Row className={className}>
      <LabelCell>
        <LabelField isEditable={isEditable} label={label} />
      </LabelCell>
      <Table.Cell>{fieldToRender()}</Table.Cell>
    </Table.Row>
  )
}

export default EditableFieldTableRow
