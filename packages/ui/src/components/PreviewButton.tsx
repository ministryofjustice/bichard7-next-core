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
  className?: string
  hideLabel?: string
  onClick: Dispatch<SetStateAction<boolean>>
  previewLabel: string
  showPreview: boolean
}

const PreviewButton = ({ className, hideLabel, onClick, previewLabel, showPreview }: PreviewButtonProps) => {
  return (
    <StyledPreviewButton
      className={"preview-button govuk-accordion__show-all" + (className ? ` ${className}` : "")}
      onClick={() => {
        onClick(!showPreview)
      }}
      type="button"
    >
      {showPreview ? <Preview label={previewLabel} /> : <Hide label={hideLabel ?? "Hide"} />}
    </StyledPreviewButton>
  )
}

export default PreviewButton
