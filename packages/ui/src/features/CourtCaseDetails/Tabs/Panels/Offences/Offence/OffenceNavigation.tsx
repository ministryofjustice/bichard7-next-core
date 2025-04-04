import { SecondaryButton } from "components/Buttons/SecondaryButton"
import { useEffect } from "react"
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
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [selectedOffenceSequenceNumber])

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
