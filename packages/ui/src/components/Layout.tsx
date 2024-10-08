import { useCurrentUser } from "context/CurrentUserContext"
import { Footer } from "govuk-react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import Permission from "types/Permission"
import ConditionalRender from "./ConditionalRender"
import Header from "./Header"
import { Banner } from "./Layout.styles"
import LinkButton from "./LinkButton"
import NavBar from "./NavBar"
import PageTemplate from "./PageTemplate"
import PhaseBanner from "./PhaseBanner"

interface BichardSwitchProps {
  href: string
}

const BichardSwitchButton: React.FC<BichardSwitchProps> = ({ href }: BichardSwitchProps) => {
  return (
    <LinkButton className={"BichardSwitch"} style={{ marginBottom: "10px" }} href={href}>
      {"Switch to old Bichard"}
    </LinkButton>
  )
}

interface Props {
  children: ReactNode
  bichardSwitch?: {
    display: boolean
    href?: string
    displaySwitchingSurveyFeedback: boolean
  }
}

const Layout = ({ children, bichardSwitch = { display: false, displaySwitchingSurveyFeedback: false } }: Props) => {
  const { basePath } = useRouter()
  const pathname = usePathname()
  const currentUser = useCurrentUser()

  let bichardSwitchUrl = bichardSwitch.href ?? "/bichard-ui/RefreshListNoRedirect"

  if (bichardSwitch.displaySwitchingSurveyFeedback) {
    const searchParams = new URLSearchParams({
      previousPath: pathname,
      redirectTo: `..${bichardSwitchUrl}`
    })
    bichardSwitchUrl = `${basePath}/switching-feedback?${searchParams}`
  }

  return (
    <>
      <Header serviceName={"Bichard7"} organisationName={"Ministry of Justice"} userName={currentUser.username} />
      <NavBar
        hasAccessToReports={currentUser.hasAccessTo[Permission.ViewReports]}
        hasAccessToUserManagement={currentUser.hasAccessTo[Permission.ViewUserManagement]}
      />
      <PageTemplate>
        <Banner>
          <PhaseBanner phase={"Beta"} />

          <ConditionalRender isRendered={bichardSwitch.display}>
            <BichardSwitchButton href={bichardSwitchUrl} />
          </ConditionalRender>
        </Banner>
        {children}
      </PageTemplate>
      <Footer
        copyright={{
          image: {
            height: 102,
            src: `${basePath}/govuk_assets/images/govuk-crest.png`,
            width: 125
          },
          link: "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/",
          text: "Crown copyright"
        }}
      />
    </>
  )
}

export default Layout
