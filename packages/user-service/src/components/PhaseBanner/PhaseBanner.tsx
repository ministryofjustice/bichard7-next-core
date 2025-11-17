import { useRouter } from "next/router"

interface PhaseBannerProps {
  phase: string
}

const PhaseBanner: React.FC<PhaseBannerProps> = ({ phase }: PhaseBannerProps) => {
  const { basePath } = useRouter()

  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag">{phase}</strong>
        <span className="govuk-phase-banner__text">
          {"This is a new service – your "}
          <a href={`${basePath}/feedback`} className="govuk-link" target="_blank" rel="noopener noreferrer">
            {"feedback"}
          </a>
          {" will help us to improve it."}
        </span>
      </p>
    </div>
  )
}

export default PhaseBanner
