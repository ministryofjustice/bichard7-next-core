import { useRouter } from "next/router"

import { MojNavContainer } from "./NavBar.styles"

interface NavItemProps {
  link: string
  name: string
  newTab?: boolean
}

interface NavBarProps {
  hasAccessToReports: boolean
  hasAccessToUserManagement: boolean
}

const NavItem: React.FC<NavItemProps> = ({ link, name, newTab }: NavItemProps) => {
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

const NavBar: React.FC<NavBarProps> = ({ hasAccessToReports, hasAccessToUserManagement }) => {
  return (
    <div className="moj-primary-navigation" role="navigation">
      <MojNavContainer className={`moj-primary-navigation__container`}>
        <div className="moj-primary-navigation__nav">
          <nav aria-label="Primary navigation" className="moj-primary-navigation">
            <ul className="moj-primary-navigation__list">
              <NavItem link={"/bichard/"} name={"Case list"} />
              {hasAccessToReports && <NavItem link={"/bichard-ui/ReturnToReportIndex"} name={"Reports"} />}
              {hasAccessToUserManagement && <NavItem link={"/users/users/"} name={"User management"} />}
              <NavItem link={"/help/"} name={"Help"} newTab />
            </ul>
          </nav>
        </div>
      </MojNavContainer>
    </div>
  )
}

export default NavBar
