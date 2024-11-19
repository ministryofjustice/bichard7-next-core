import Link from "next/link"
import { usePathname } from "next/navigation"
interface PhaseBannerProps {
  phase: string
}

const PhaseBanner: React.FC<PhaseBannerProps> = ({ phase }: PhaseBannerProps) => {
  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
        <span className="govuk-phase-banner__text">
          {"This is a new service – your "}
          {/* TODO: Get /bichard from config */}
          <Link className="govuk-link" href={`/feedback?previousPath=${usePathname()}`}>
            {"feedback"}
          </Link>
          {" will help us to improve it."}
        </span>
      </p>
    </div>
  )
}

export default PhaseBanner
