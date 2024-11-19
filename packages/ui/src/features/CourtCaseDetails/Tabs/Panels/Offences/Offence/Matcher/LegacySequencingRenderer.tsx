import { OffenceMatchingException } from "utils/offenceMatcher/getOffenceMatchingException"

import LegacySequencingBadgeTableRow from "./TableRows/LegacySequencingBadgeTableRow"
import LegacySequencingMessageTableRow from "./TableRows/LegacySequencingMessageTableRow"

interface LegacySequencingRenderProps {
  offenceMatchingException?: boolean | OffenceMatchingException
  offenceMatchingExceptionMessage?: string
  offenceReasonSequence?: null | string
}

const LegacySequencingRenderer = ({
  offenceMatchingException,
  offenceMatchingExceptionMessage,
  offenceReasonSequence
}: LegacySequencingRenderProps): JSX.Element => {
  return (
    <>
      {offenceMatchingException ? (
        <LegacySequencingMessageTableRow
          exception={offenceMatchingException as OffenceMatchingException}
          message={offenceMatchingExceptionMessage}
        />
      ) : (
        <LegacySequencingBadgeTableRow offenceReasonSequence={offenceReasonSequence} />
      )}
    </>
  )
}

export default LegacySequencingRenderer
