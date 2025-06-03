import { useRouter } from "next/router"
import { blue } from "utils/colours"
import { updateTabLink } from "utils/updateTabLink"

interface BackToAllOffencesLinkProps {
  onClick: () => void
}

export const BackToAllOffencesLink = ({ onClick }: BackToAllOffencesLinkProps) => {
  const router = useRouter()
  const newPath = updateTabLink(router, "Offences")

  return (
    <a
      style={{ color: blue }}
      href={router.basePath + newPath}
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
