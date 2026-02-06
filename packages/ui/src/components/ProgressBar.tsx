import { ProgressContainer, ProgressTrack, ProgressFill, ProgressSeparator } from "./ProgressBar.styles"

interface ProgressBarProps {
  currentValue: number
  maxValue: number
  label?: string
}

export const ProgressBar = ({ currentValue, maxValue, label }: ProgressBarProps) => {
  label = label || `Page ${currentValue} of ${maxValue}`
  const progressWidth: number = Number(currentValue / maxValue) * 100

  return (
    <>
      <h2 className="govuk-heading-m" id="progress-bar-label">
        {currentValue && <label>{label}</label>}
      </h2>

      <ProgressContainer>
        <ProgressTrack
          role="progressbar"
          aria-labelledby="progress-bar-label"
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={maxValue}
        >
          <ProgressFill $width={progressWidth} />

          {progressWidth > 0 && <ProgressSeparator />}
        </ProgressTrack>
      </ProgressContainer>
    </>
  )
}
