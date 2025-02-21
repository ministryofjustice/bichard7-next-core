import ErrorIcon from "components/ErrorIcon"

interface LabelFieldProps {
  label: string
  showErrorIcon: boolean
}

const LabelField: React.FC<LabelFieldProps> = ({ label, showErrorIcon }) => {
  return (
    <>
      {label}
      {showErrorIcon && (
        <div className="error-icon">
          <ErrorIcon />
        </div>
      )}
    </>
  )
}

export default LabelField
