import type { OffenceMatchingException } from "utils/offenceMatcher/getOffenceMatchingException"

import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"

interface LegacySequencingMessageTableRowProps {
  exception: OffenceMatchingException
  message?: string
}

const LegacySequencingMessageTableRow = ({ exception, message }: LegacySequencingMessageTableRowProps): JSX.Element => {
  const { courtCase } = useCourtCase()

  return (
    <ExceptionFieldTableRow badgeText={exception.badge} label={"PNC sequence number"} message={message}>
      {" "}
      <>
        {"Court Case Reference:"}
        <br />
        {courtCase.courtReference}
      </>
    </ExceptionFieldTableRow>
  )
}

export default LegacySequencingMessageTableRow
