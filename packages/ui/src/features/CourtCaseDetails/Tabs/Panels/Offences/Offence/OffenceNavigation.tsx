import { SecondaryButton } from "components/Buttons"
import { GridCol, GridRow } from "govuk-react"
import { BackToAllOffencesLink } from "./BackToAllOffencesLink"
import { NextButton, PreviousButton } from "./OffenceNavigation.styles"

interface OffenceNavigationProps {
  onBackToAllOffences: () => void
  selectedOffenceSequenceNumber: number
  onPreviousClick: () => void
  onNextClick: () => void
  offencesCount: number
}

export const OffenceNavigation = ({
  onBackToAllOffences,
  selectedOffenceSequenceNumber,
  onPreviousClick,
  onNextClick,
  offencesCount
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
