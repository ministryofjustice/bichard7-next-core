import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"
import findCandidates from "utils/offenceMatcher/findCandidates"
import getExceptionMessage from "utils/offenceMatcher/getExceptionMessage"

import OffenceMatcher from "../OffenceMatcher"

interface OffenceMatcherTableRowProps {
  isCaseLockedToCurrentUser: boolean
  offenceIndex: number
}

const OffenceMatcherTableRow = ({
  isCaseLockedToCurrentUser,
  offenceIndex
}: OffenceMatcherTableRowProps): JSX.Element => {
  const { courtCase } = useCourtCase()
  const offenceMatchingExceptionMessage = getExceptionMessage(courtCase, offenceIndex)

  return (
    <ExceptionFieldTableRow
      label={"Matched PNC offence"}
      value={
        <OffenceMatcher
          candidates={findCandidates(courtCase, offenceIndex)}
          isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
          offenceIndex={offenceIndex}
        />
      }
    >
      <ErrorPromptMessage message={offenceMatchingExceptionMessage} />
    </ExceptionFieldTableRow>
  )
}

export default OffenceMatcherTableRow
