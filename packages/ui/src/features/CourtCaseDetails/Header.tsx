import Permission from "@moj-bichard7/common/types/Permission"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import { HeaderContainer, HeaderRow } from "components/Header/Header.styles"
import LinkButton from "components/LinkButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

import { DisplayFullCourtCase } from "types/display/CourtCases"
import { isLockedByCurrentUser } from "utils/caseLocks"
import { gdsLightGrey, gdsMidGrey, textPrimary } from "utils/colours"
import Form from "../../components/Form"
import getResolutionStatus from "../../utils/getResolutionStatus"
import ResolutionStatusBadge from "../CourtCaseList/tags/ResolutionStatusBadge"
import { ButtonContainer, LockedTagContainer, StyledButton, StyledSecondaryButton } from "./Header.styles"
import LockStatusTag from "./LockStatusTag"

interface Props {
  canReallocate: boolean
}

const getUnlockPath = (courtCase: DisplayFullCourtCase): URLSearchParams => {
  const params = new URLSearchParams()
  if (courtCase.errorLockedByUsername) {
    params.set("unlockException", courtCase.errorId?.toString())
  }
  if (courtCase.triggerLockedByUsername) {
    params.set("unlockTrigger", courtCase.errorId?.toString())
  }
  return params
}

const Header: React.FC<Props> = ({ canReallocate }: Props) => {
  const { basePath } = useRouter()
  const { csrfToken } = useCsrfToken()
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()
  const previousPath = usePreviousPath()

  const leaveAndUnlockParams = getUnlockPath(courtCase)

  const pathName = usePathname()

  let reallocatePath = `${basePath}${pathName}`
  let leaveAndUnlockUrl = `${basePath}?${leaveAndUnlockParams.toString()}`

  if (!pathName.includes("/reallocate")) {
    reallocatePath += "/reallocate"
  }

  if (previousPath) {
    leaveAndUnlockUrl += `&${previousPath}`
    reallocatePath += `?previousPath=${encodeURIComponent(previousPath)}`
  }

  const caseIsViewOnly = !isLockedByCurrentUser(courtCase, currentUser.username)
  const hasCaseLock = isLockedByCurrentUser(courtCase, currentUser.username)

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

      <ButtonContainer>
        <ConditionalRender isRendered={canReallocate && courtCase.phase === 1 && !pathName.includes("/reallocate")}>
          <LinkButton
            href={reallocatePath}
            className="b7-reallocate-button"
            buttonColour={gdsLightGrey}
            buttonTextColour={textPrimary}
            buttonShadowColour={gdsMidGrey}
          >
            {"Reallocate Case"}
          </LinkButton>
        </ConditionalRender>
        <ConditionalRender isRendered={hasCaseLock}>
          <a href={basePath}>
            <StyledButton id="leave-and-lock" className={`button`}>
              {"Leave and lock"}
            </StyledButton>
          </a>
          <Form method="post" action={leaveAndUnlockUrl} csrfToken={csrfToken}>
            <StyledButton id="leave-and-unlock" className={`button`} type="submit">
              {"Leave and unlock"}
            </StyledButton>
          </Form>
        </ConditionalRender>
        <ConditionalRender isRendered={!hasCaseLock}>
          <a href={basePath}>
            <StyledSecondaryButton id="return-to-case-list" className={`button`}>
              {"Return to case list"}
            </StyledSecondaryButton>
          </a>
        </ConditionalRender>
      </ButtonContainer>
    </HeaderContainer>
  )
}

export default Header
