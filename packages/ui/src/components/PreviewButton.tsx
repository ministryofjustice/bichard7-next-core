import { Dispatch, SetStateAction } from "react"
import { StyledPreviewButton } from "./PreviewButton.styles"

const Preview = (props: { label: string }) => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down"></span>
      <span className="govuk-accordion__show-all-text">{props.label}</span>
    </>
  )
}

const Hide = (props: { label: string }) => {
  return (
    <>
      <span className="govuk-accordion-nav__chevron"></span>
      <span className="govuk-accordion__show-all-text">{props.label}</span>
    </>
  )
}

interface PreviewButtonProps {
  showPreview: boolean
  onClick: Dispatch<SetStateAction<boolean>>
  previewLabel: string
  hideLabel?: string
  className?: string
}

const PreviewButton = ({ showPreview, onClick, previewLabel, hideLabel, className }: PreviewButtonProps) => {
  return (
    <StyledPreviewButton
      type="button"
      className={"preview-button govuk-accordion__show-all" + (className ? ` ${className}` : "")}
      onClick={() => {
        onClick(!showPreview)
      }}
    >
      {showPreview ? <Preview label={previewLabel} /> : <Hide label={hideLabel ?? "Hide"} />}
    </StyledPreviewButton>
  )
}

export default PreviewButton
