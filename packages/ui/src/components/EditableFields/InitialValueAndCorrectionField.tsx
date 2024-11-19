import { CorrectionBadge, InitialInputValueBadge } from "./Badges"

interface InitialValueAndCorrectionFieldProps {
  updatedValue?: null | string
  value?: React.ReactNode | string
}

const InitialValueAndCorrectionField: React.FC<InitialValueAndCorrectionFieldProps> = ({ updatedValue, value }) => {
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
