import ErrorIcon from "components/ErrorIcon"

interface LabelFieldProps {
  label: string
  isEditable: boolean
}

const LabelField: React.FC<LabelFieldProps> = ({ label, isEditable }) => {
  return (
    <>
      {label}
      {isEditable && (
        <div className="error-icon">
          <ErrorIcon />
        </div>
      )}
    </>
  )
}

export default LabelField
