import { OffenceMatchingException } from "utils/offenceMatcher/getOffenceMatchingException"
import LegacySequencingBadgeRow from "./Rows/LegacySequencingBadgeRow"
import LegacySequencingMessageRow from "./Rows/LegacySequencingMessageRow"

interface LegacySequencingRenderProps {
  offenceMatchingException?: OffenceMatchingException | boolean
  offenceMatchingExceptionMessage?: string
  offenceReasonSequence?: string | null
}

const LegacySequencingRenderer = ({
  offenceMatchingException,
  offenceMatchingExceptionMessage,
  offenceReasonSequence
}: LegacySequencingRenderProps): React.ReactNode => {
  return (
    <>
      {offenceMatchingException ? (
        <LegacySequencingMessageRow
          exception={offenceMatchingException as OffenceMatchingException}
          message={offenceMatchingExceptionMessage}
        />
      ) : (
        <LegacySequencingBadgeRow offenceReasonSequence={offenceReasonSequence} />
      )}
    </>
  )
}

export default LegacySequencingRenderer
