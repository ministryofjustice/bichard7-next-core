import ExceptionFieldRow from "components/ExceptionFieldRow"
import { useCourtCase } from "context/CourtCaseContext"
import type { OffenceMatchingException } from "utils/offenceMatcher/getOffenceMatchingException"

interface LegacySequencingMessageTableRowProps {
  exception: OffenceMatchingException
  message?: string
}

const LegacySequencingMessageTableRow = ({
  exception,
  message
}: LegacySequencingMessageTableRowProps): React.ReactNode => {
  const { courtCase } = useCourtCase()

  return (
    <ExceptionFieldRow badgeText={exception.badge} label={"PNC sequence number"} message={message}>
      {" "}
      <>
        {"Court Case Reference:"}
        <br />
        {courtCase.courtReference}
      </>
    </ExceptionFieldRow>
  )
}

export default LegacySequencingMessageTableRow
