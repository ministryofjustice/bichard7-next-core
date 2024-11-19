import type { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"

import { Exception } from "types/exceptions"

import { OffenceDetails } from "./Offence/OffenceDetails"
import { OffencesList } from "./OffencesList/OffencesList"

interface OffencesProps {
  exceptions: Exception[]
  offences: Offence[]
  onOffenceSelected: (offenceIndex?: number) => void
  selectedOffenceSequenceNumber?: number
  visible: boolean
}

export const Offences = ({
  exceptions,
  offences,
  onOffenceSelected,
  selectedOffenceSequenceNumber,
  visible
}: OffencesProps) => {
  return (
    <div hidden={!visible}>
      {selectedOffenceSequenceNumber !== undefined && offences[selectedOffenceSequenceNumber - 1] !== undefined ? (
        <OffenceDetails
          exceptions={exceptions}
          offence={offences[selectedOffenceSequenceNumber - 1]}
          offencesCount={offences.length}
          onBackToAllOffences={() => onOffenceSelected(undefined)}
          onNextClick={() => onOffenceSelected(selectedOffenceSequenceNumber + 1)}
          onPreviousClick={() => onOffenceSelected(selectedOffenceSequenceNumber - 1)}
          selectedOffenceSequenceNumber={selectedOffenceSequenceNumber}
        />
      ) : (
        <OffencesList offences={offences} setDetailedOffenceIndex={onOffenceSelected} />
      )}
    </div>
  )
}
