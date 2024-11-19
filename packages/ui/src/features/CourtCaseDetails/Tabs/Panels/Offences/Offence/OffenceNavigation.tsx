import { SecondaryButton } from "components/Buttons"
import { GridCol, GridRow } from "govuk-react"

import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { NextButton, PreviousButton } from "./OffenceNavigation.styles"

interface OffenceNavigationProps {
  offencesCount: number
  onBackToAllOffences: () => void
  onNextClick: () => void
  onPreviousClick: () => void
  selectedOffenceSequenceNumber: number
}

export const OffenceNavigation = ({
  offencesCount,
  onBackToAllOffences,
  onNextClick,
  onPreviousClick,
  selectedOffenceSequenceNumber
}: OffenceNavigationProps) => {
  return (
    <GridRow>
      <GridCol>
        <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
      </GridCol>
      <GridCol>
        <PreviousButton>
          {selectedOffenceSequenceNumber !== 1 && (
            <SecondaryButton onClick={() => onPreviousClick()}>{"Previous offence"}</SecondaryButton>
          )}
          {selectedOffenceSequenceNumber !== offencesCount && (
            <NextButton>
              <SecondaryButton onClick={() => onNextClick()}>{"Next offence"}</SecondaryButton>
            </NextButton>
          )}
        </PreviousButton>
      </GridCol>
    </GridRow>
  )
}
