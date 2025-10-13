import Footer from "components/Footer"
import Header from "components/Header"
import { ReactNode } from "react"
import User from "types/User"
import { UserServiceAccess } from "useCases/getUserServiceAccess"
import NavBar from "./NavBar"
import PageTemplate from "./PageTemplate"
import PhaseBanner from "./PhaseBanner"
import { basePath } from "../../next.config"

interface Props {
  children: ReactNode
  user?: Partial<User>
  hasAccessTo?: UserServiceAccess
}

/* eslint-disable jsx-a11y/alt-text, @next/next/no-img-element */
const FakeAssetForNoJsStatsGathering = () => (
  <noscript>
    <img src="/assets/nojs.png" className="govuk-!-display-none" />
  </noscript>
)

const ScreenSizeStats = () => <script src={`${basePath}/js/grabScreenSize.js`} async />

/* eslint-enable jsx-a11y/alt-text, @next/next/no-img-element */
const Layout = ({ children, user, hasAccessTo }: Props) => (
  <>
    <FakeAssetForNoJsStatsGathering />
    <Header serviceName="Bichard7" userName={user?.username ?? ""} organisationName={"Ministry of Justice"} />
    {hasAccessTo && hasAccessTo.hasAccessToNewBichard ? (
      <NavBar
        hasAccessToReports={hasAccessTo.hasAccessToReports ?? false}
        hasAccessToUserManagement={hasAccessTo.hasAccessToUserManagement ?? false}
      />
    ) : undefined}

    <PageTemplate>
      <PhaseBanner phase={"Beta"} />

      {children}
    </PageTemplate>

    <Footer />
    <ScreenSizeStats />
  </>
)

export default Layout
