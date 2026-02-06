import { gdsBlue, gdsDarkGreen, white } from "../utils/colours"

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

      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            backgroundColor: `${gdsBlue}`,
            height: "15px"
          }}
          role="progressbar"
          aria-labelledby="progress-bar-label"
          aria-valuenow={currentValue}
          aria-valuemin={0}
          aria-valuemax={maxValue}
        >
          <div
            style={{
              width: `${progressWidth}%`,
              backgroundColor: `${gdsDarkGreen}`
            }}
          />

          {progressWidth > 0 && (
            <div
              style={{
                width: "5px",
                backgroundColor: `${white}`
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}
