import { CheckmarkIcon } from "../../features/CourtCaseDetails/Tabs/CourtCaseDetailsSingleTab.styles"
import { SUCCESS_CHECKMARK_ICON_URL } from "../../utils/icons"
import { Message, SuccessMessageContainer } from "./SuccessMessage.styles"

interface SuccessMessageProps {
  message: string
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  return (
    <SuccessMessageContainer className="success-message">
      <CheckmarkIcon
        alt="Checkmark icon"
        className={`checkmark-icon checkmark`}
        height={30}
        src={SUCCESS_CHECKMARK_ICON_URL}
        width={30}
      />
      <Message>
        <b>{message}</b>
      </Message>
    </SuccessMessageContainer>
  )
}

export default SuccessMessage
