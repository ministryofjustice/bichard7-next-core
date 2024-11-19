import { WARNING_ICON_URL } from "utils/icons"

import { ErrorMessageContainer, Message, WarningIcon } from "./ErrorMessage.styles"

interface ErrorMessageProps {
  message: string
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <ErrorMessageContainer className="error-message">
      <WarningIcon alt="Warning icon" className={"warning-icon"} height={25} src={WARNING_ICON_URL} width={25} />
      <Message>
        <b>{message}</b>
      </Message>
    </ErrorMessageContainer>
  )
}

export default ErrorMessage
