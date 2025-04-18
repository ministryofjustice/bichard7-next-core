import { blue } from "utils/colours"

interface BackToAllOffencesLinkProps {
  onClick: () => void
}

export const BackToAllOffencesLink = ({ onClick }: BackToAllOffencesLinkProps) => {
  return (
    <a
      style={{ color: blue }}
      href="/"
      className="govuk-back-link"
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
    >
      {"Back to all offences"}
    </a>
  )
}
