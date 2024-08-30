import { CheckmarkIcon } from "../../features/CourtCaseDetails/Tabs/CourtCaseDetailsSingleTab.styles"
import { SUCCESS_CHECKMARK_ICON_URL } from "../../utils/icons"
import { SuccessMessageContainer, Message } from "./SuccessMessage.styles"

interface SuccessMessageProps {
  message: string
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <SuccessMessageContainer className="success-message">
      <CheckmarkIcon
        className={`checkmark-icon checkmark`}
        src={SUCCESS_CHECKMARK_ICON_URL}
        width={30}
        height={30}
        alt="Checkmark icon"
      />
      <Message>
        <b>{message}</b>
      </Message>
    </SuccessMessageContainer>
  )
}

export default SuccessMessage
