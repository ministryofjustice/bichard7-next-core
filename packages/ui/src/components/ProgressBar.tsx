import { ProgressContainer, ProgressTracker, ProgressFill, ProgressSeparator } from "./ProgressBar.styles"
import { useId } from "react"

interface ProgressBarProps {
  currentCount: number
  maxCount: number
  labelType: "percentage" | "pageCount"
}

export const ProgressBar = ({ currentCount, maxCount, labelType }: ProgressBarProps) => {
  const labelId = useId()

  if (currentCount <= 0) {
    return null
  }

  const clampedValue = Math.min(Math.max(currentCount, 0), maxCount)

  const safeMax = maxCount > 0 ? maxCount : 1
  const percentage = (clampedValue / safeMax) * 100

  const displayLabel = labelType === "percentage" ? `Progress: ${percentage}%` : `Page ${clampedValue} of ${maxCount}`

  return (
    <section aria-labelledby={labelId}>
      <span className="govuk-heading-m" id={labelId}>
        <span className="govuk-visually-hidden">{"Progress Bar Label: "}</span>
        {displayLabel}
      </span>

      <ProgressContainer>
        <ProgressTracker role="progressbar" aria-valuenow={currentCount} aria-valuemin={0} aria-valuemax={maxCount}>
          <ProgressFill $width={percentage} />

          {percentage > 0 && percentage < 100 && <ProgressSeparator />}
        </ProgressTracker>
      </ProgressContainer>
    </section>
  )
}
