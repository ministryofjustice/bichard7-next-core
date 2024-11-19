import { textBlue } from "utils/colours"

interface BackToAllOffencesLinkProps {
  onClick: () => void
}

export const BackToAllOffencesLink = ({ onClick }: BackToAllOffencesLinkProps) => {
  return (
    <a
      className="govuk-back-link"
      href="/"
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      style={{ color: textBlue }}
    >
      {"Back to all offences"}
    </a>
  )
}
