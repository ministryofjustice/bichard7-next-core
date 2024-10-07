import { useRouter } from "next/router"
import { MojNavContainer } from "./NavBar.styles"

interface NavItemProps {
  name: string
  link: string
  newTab?: boolean
}

interface NavBarProps {
  hasAccessToUserManagement: boolean
  hasAccessToReports: boolean
}

const NavItem: React.FC<NavItemProps> = ({ name, link, newTab }: NavItemProps) => {
  const { basePath } = useRouter()
  const ariaCurrent = link === basePath + "/" ? "page" : undefined

  return (
    <li className="moj-primary-navigation__item">
      <a
        aria-current={ariaCurrent}
        className="moj-primary-navigation__link"
        href={link}
        target={newTab ? "_blank" : "_self"}
      >
        {name}
      </a>
    </li>
  )
}

const NavBar: React.FC<NavBarProps> = ({ hasAccessToUserManagement, hasAccessToReports }) => {
  return (
    <div className="moj-primary-navigation" role="navigation">
      <MojNavContainer className={`moj-primary-navigation__container`}>
        <div className="moj-primary-navigation__nav">
          <nav className="moj-primary-navigation" aria-label="Primary navigation">
            <ul className="moj-primary-navigation__list">
              <NavItem name={"Case list"} link={"/bichard/"} />
              {hasAccessToReports && <NavItem name={"Reports"} link={"/bichard-ui/ReturnToReportIndex"} />}
              {hasAccessToUserManagement && <NavItem name={"User management"} link={"/users/users/"} />}
              <NavItem name={"Help"} link={"/help/"} newTab />
            </ul>
          </nav>
        </div>
      </MojNavContainer>
    </div>
  )
}

export default NavBar
