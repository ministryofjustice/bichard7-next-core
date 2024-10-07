import { CorrectionBadge, InitialInputValueBadge } from "./Badges"

interface InitialValueAndCorrectionFieldProps {
  value?: string | React.ReactNode
  updatedValue?: string | null
}

const InitialValueAndCorrectionField: React.FC<InitialValueAndCorrectionFieldProps> = ({ value, updatedValue }) => {
  return (
    <>
      {value}
      <InitialInputValueBadge />
      <br />
      {updatedValue}
      <CorrectionBadge />
    </>
  )
}

export default InitialValueAndCorrectionField
