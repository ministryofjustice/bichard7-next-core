import { SecondaryButton } from "components/Buttons/SecondaryButton"
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
    <div className="govuk-grid-row">
      <div className="govuk-grid-column-one-half">
        <BackToAllOffencesLink onClick={() => onBackToAllOffences()} />
      </div>
      <div className="govuk-grid-column-one-half">
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
      </div>
    </div>
  )
}
