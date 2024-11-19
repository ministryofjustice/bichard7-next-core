import ErrorIcon from "components/ErrorIcon"

interface LabelFieldProps {
  isEditable: boolean
  label: string
}

const LabelField: React.FC<LabelFieldProps> = ({ isEditable, label }) => {
  return (
    <>
      <b>
        <div>{label}</div>
      </b>
      {isEditable && (
        <div className="error-icon">
          <ErrorIcon />
        </div>
      )}
    </>
  )
}

export default LabelField
