import Permission from "@moj-bichard7/common/types/Permission"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import { HeaderContainer, HeaderRow } from "components/Header/Header.styles"
import LinkButton from "components/LinkButton"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { Heading } from "govuk-react"
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
  const csrfToken = useCsrfToken()
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
        <Heading as="h1" className="hidden-header" size="LARGE">
          {"Case details"}
        </Heading>
        <Heading as="h2" size="MEDIUM">
          {courtCase.defendantName}
          {<ResolutionStatusBadge resolutionStatus={getResolutionStatus(courtCase)} />}
          <Badge
            className="govuk-!-static-margin-left-5 view-only-badge moj-badge--large"
            colour={BadgeColours.Blue}
            isRendered={caseIsViewOnly}
            label="View only"
          />
        </Heading>
        <LockedTagContainer>
          <LockStatusTag
            isRendered={currentUser.hasAccessTo[Permission.Exceptions]}
            lockName="Exceptions"
            resolutionStatus={courtCase.errorStatus}
          />
          <LockStatusTag
            isRendered={currentUser.hasAccessTo[Permission.Triggers]}
            lockName="Triggers"
            resolutionStatus={courtCase.triggerStatus}
          />
        </LockedTagContainer>
      </HeaderRow>

      <ButtonContainer>
        <ConditionalRender isRendered={canReallocate && courtCase.phase === 1 && !pathName.includes("/reallocate")}>
          <LinkButton
            buttonColour={gdsLightGrey}
            buttonShadowColour={gdsMidGrey}
            buttonTextColour={textPrimary}
            className="b7-reallocate-button"
            href={reallocatePath}
          >
            {"Reallocate Case"}
          </LinkButton>
        </ConditionalRender>
        <ConditionalRender isRendered={hasCaseLock}>
          <a href={basePath}>
            <StyledButton className={`button`} id="leave-and-lock">
              {"Leave and lock"}
            </StyledButton>
          </a>
          <Form action={leaveAndUnlockUrl} csrfToken={csrfToken} method="post">
            <StyledButton className={`button`} id="leave-and-unlock" type="submit">
              {"Leave and unlock"}
            </StyledButton>
          </Form>
        </ConditionalRender>
        <ConditionalRender isRendered={!hasCaseLock}>
          <a href={basePath}>
            <StyledSecondaryButton className={`button`} id="return-to-case-list">
              {"Return to case list"}
            </StyledSecondaryButton>
          </a>
        </ConditionalRender>
      </ButtonContainer>
    </HeaderContainer>
  )
}

export default Header
