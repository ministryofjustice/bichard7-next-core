import type { Dispatch, SetStateAction } from "react"
import { StyledPreviewButton } from "./PreviewButton.styles"
import { mergeClassNames } from "../helpers/mergeClassNames"

interface PreviewButtonProps {
  showPreview: boolean
  onClick: Dispatch<SetStateAction<boolean>>
  previewLabel: string
  hideLabel?: string
  className?: string
  ariaControls: string
}

const PreviewButton = ({
  showPreview,
  onClick,
  previewLabel,
  hideLabel,
  className,
  ariaControls
}: PreviewButtonProps) => {
  const label = showPreview ? previewLabel : (hideLabel ?? "Hide")

  return (
    <StyledPreviewButton
      type="button"
      className={mergeClassNames("preview-button govuk-accordion__show-all", className)}
      onClick={() => {
        onClick(!showPreview)
      }}
      aria-expanded={!showPreview}
      aria-controls={ariaControls}
    >
      <span
        className={mergeClassNames(
          "govuk-accordion-nav__chevron",
          showPreview ? "govuk-accordion-nav__chevron--down" : undefined
        )}
      ></span>
      <span className="govuk-accordion__show-all-text">{label}</span>
    </StyledPreviewButton>
  )
}

export default PreviewButton
