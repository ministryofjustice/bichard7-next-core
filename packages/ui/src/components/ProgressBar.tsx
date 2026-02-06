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
            backgroundColor: "#1D70B8",
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
              backgroundColor: "#005A30"
            }}
          />

          {progressWidth > 0 && (
            <div
              style={{
                width: "5px",
                backgroundColor: "#FFF"
              }}
            />
          )}
        </div>
      </div>
    </>
  )
}
