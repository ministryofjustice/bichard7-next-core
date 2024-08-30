import type { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Exception } from "types/exceptions"
import { OffenceDetails } from "./Offence/OffenceDetails"
import { OffencesList } from "./OffencesList/OffencesList"

interface OffencesProps {
  visible: boolean
  offences: Offence[]
  onOffenceSelected: (offenceIndex?: number) => void
  selectedOffenceSequenceNumber?: number
  exceptions: Exception[]
}

export const Offences = ({
  visible,
  offences,
  onOffenceSelected,
  selectedOffenceSequenceNumber,
  exceptions
}: OffencesProps) => {
  return (
    <div hidden={!visible}>
      {selectedOffenceSequenceNumber !== undefined && offences[selectedOffenceSequenceNumber - 1] !== undefined ? (
        <OffenceDetails
          offence={offences[selectedOffenceSequenceNumber - 1]}
          offencesCount={offences.length}
          onBackToAllOffences={() => onOffenceSelected(undefined)}
          onNextClick={() => onOffenceSelected(selectedOffenceSequenceNumber + 1)}
          onPreviousClick={() => onOffenceSelected(selectedOffenceSequenceNumber - 1)}
          selectedOffenceSequenceNumber={selectedOffenceSequenceNumber}
          exceptions={exceptions}
        />
      ) : (
        <OffencesList offences={offences} setDetailedOffenceIndex={onOffenceSelected} />
      )}
    </div>
  )
}
