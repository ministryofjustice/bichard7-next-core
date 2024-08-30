import { ErrorPrompt } from "./ErrorPromptMessage.styles"

type Props = {
  message?: string
}

const ErrorPromptMessage = ({ message }: Props) => {
  return <ErrorPrompt className={`error-prompt`}>{message}</ErrorPrompt>
}

export default ErrorPromptMessage
