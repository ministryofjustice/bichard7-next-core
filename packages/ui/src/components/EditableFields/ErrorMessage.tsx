import { ErrorMessageContainer, Message, WarningIcon } from "./ErrorMessage.styles"
import { WARNING_ICON_URL } from "utils/icons"

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <ErrorMessageContainer className="error-message">
      <WarningIcon className={"warning-icon"} src={WARNING_ICON_URL} width={25} height={25} alt="Warning icon" />
      <Message>
        <b>{message}</b>
      </Message>
    </ErrorMessageContainer>
  )
}

export default ErrorMessage
