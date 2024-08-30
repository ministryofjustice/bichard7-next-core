import ErrorIcon from "components/ErrorIcon"

interface LabelFieldProps {
  label: string
  isEditable: boolean
}

const LabelField: React.FC<LabelFieldProps> = ({ label, isEditable }) => {
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
