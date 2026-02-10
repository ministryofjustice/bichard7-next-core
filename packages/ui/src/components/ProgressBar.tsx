import { ProgressContainer, ProgressTracker, ProgressFill, ProgressSeparator } from "./ProgressBar.styles"
import { useId } from "react"

interface ProgressBarProps {
  currentValue: number
  maxValue: number
  labelType?: string
}

export const ProgressBar = ({ currentValue, maxValue, labelType }: ProgressBarProps) => {
  const labelId = useId()

  if (currentValue <= 0) {
    return null
  }

  const clampedValue = Math.min(Math.max(currentValue, 0), maxValue)

  const safeMax = maxValue > 0 ? maxValue : 1
  const percentage = (clampedValue / safeMax) * 100

  const displayLabel = labelType === "percentage" ? `Progress: ${percentage}%` : `Page ${clampedValue} of ${maxValue}`

  return (
    <section aria-labelledby={labelId}>
      <span className="govuk-heading-m" id={labelId}>
        <span className="govuk-visually-hidden">{"Progress Bar Label: "}</span>
        {displayLabel}
      </span>

      <ProgressContainer>
        <ProgressTracker role="progressbar" aria-valuenow={currentValue} aria-valuemin={0} aria-valuemax={maxValue}>
          <ProgressFill $width={percentage} />

          {percentage > 0 && percentage < 100 && <ProgressSeparator />}
        </ProgressTracker>
      </ProgressContainer>
    </section>
  )
}
