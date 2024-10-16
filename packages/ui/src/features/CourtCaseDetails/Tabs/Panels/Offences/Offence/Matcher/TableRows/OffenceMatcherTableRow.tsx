import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
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
}: OffenceMatcherTableRowProps): JSX.Element => {
  const { courtCase } = useCourtCase()
  const offenceMatchingExceptionMessage = getExceptionMessage(courtCase, offenceIndex)

  return (
    <ExceptionFieldTableRow
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
    </ExceptionFieldTableRow>
  )
}

export default OffenceMatcherTableRow
