import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldRow from "components/ExceptionFieldRow"
import { useCourtCase } from "context/CourtCaseContext"
import findCandidates from "utils/offenceMatcher/findCandidates"
import getExceptionMessage from "utils/offenceMatcher/getExceptionMessage"
import OffenceMatcher from "../OffenceMatcher"

interface OffenceMatcherTableRowProps {
  offenceIndex: number
  isCaseLockedToCurrentUser: boolean
}

const OffenceMatcherTableRow = ({
  offenceIndex,
  isCaseLockedToCurrentUser
}: OffenceMatcherTableRowProps): React.ReactNode => {
  const { courtCase } = useCourtCase()
  const offenceMatchingExceptionMessage = getExceptionMessage(courtCase, offenceIndex)

  return (
    <ExceptionFieldRow
      label={"Matched PNC offence"}
      value={
        <OffenceMatcher
          offenceIndex={offenceIndex}
          candidates={findCandidates(courtCase, offenceIndex)}
          isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
        />
      }
    >
      <ErrorPromptMessage message={offenceMatchingExceptionMessage} />
    </ExceptionFieldRow>
  )
}

export default OffenceMatcherTableRow
