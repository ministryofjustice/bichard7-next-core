import Permission from "@moj-bichard7/common/types/Permission"
import Badge, { BadgeColours } from "components/Badge"
import { HeaderContainer, HeaderRow } from "components/Header/Header.styles"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"

import { isLockedByCurrentUser } from "utils/caseLocks"
import getResolutionStatus from "../../utils/getResolutionStatus"
import ResolutionStatusBadge from "../CourtCaseList/tags/ResolutionStatusBadge"
import { LockedTagContainer } from "./Header.styles"
import LockStatusTag from "./LockStatusTag"

interface Props {
  canReallocate: boolean
}

const Header: React.FC<Props> = () => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()

  const caseIsViewOnly = !isLockedByCurrentUser(courtCase, currentUser.username)

  return (
    <HeaderContainer id="header-container">
      <HeaderRow>
        <h1 className="hidden-header govuk-heading-l">{"Case details"}</h1>
        <h2 className="govuk-heading-m">
          {courtCase.defendantName}
          {<ResolutionStatusBadge resolutionStatus={getResolutionStatus(courtCase)} />}
          <Badge
            isRendered={caseIsViewOnly}
            label="View only"
            colour={BadgeColours.Blue}
            className="govuk-!-static-margin-left-5 view-only-badge moj-badge--large"
          />
        </h2>
        <LockedTagContainer>
          <LockStatusTag
            isRendered={currentUser.hasAccessTo[Permission.Exceptions]}
            resolutionStatus={courtCase.errorStatus}
            lockName="Exceptions"
          />
          <LockStatusTag
            isRendered={currentUser.hasAccessTo[Permission.Triggers]}
            resolutionStatus={courtCase.triggerStatus}
            lockName="Triggers"
          />
        </LockedTagContainer>
      </HeaderRow>
    </HeaderContainer>
  )
}

export default Header
