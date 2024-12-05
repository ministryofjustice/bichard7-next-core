import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
interface PhaseBannerProps {
  phase: string
}

const generateLink = (pathname: string, searchParams: string) => {
  switch (pathname) {
    case "/feedback":
      return `/feedback?${searchParams}`
    case "/switching-feedback":
      return `/switching-feedback?${searchParams}`
    default:
      return `/feedback?previousPath=${pathname}`
  }
}

const PhaseBanner: React.FC<PhaseBannerProps> = ({ phase }: PhaseBannerProps) => {
  const link = generateLink(usePathname(), useSearchParams().toString())

  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
        <span className="govuk-phase-banner__text">
          {"This is a new service - your "}
          {/* TODO: Get /bichard from config */}
          <Link href={link} className="govuk-link">
            {"feedback"}
          </Link>
          {" will help us to improve it."}
        </span>
      </p>
    </div>
  )
}

export default PhaseBanner
