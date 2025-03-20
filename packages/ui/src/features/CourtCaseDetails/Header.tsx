import Permission from "@moj-bichard7/common/types/Permission"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

import { isLockedByCurrentUser } from "services/case"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import Form from "../../components/Form"
import getResolutionStatus from "../../utils/getResolutionStatus"
import ResolutionStatusBadge from "../CourtCaseList/tags/ResolutionStatusBadge"
import CourtCaseDetailsSummaryBox from "./CourtCaseDetailsSummaryBox"
import {
  ButtonContainer,
  CaseDetailHeaderContainer,
  CaseDetailHeaderRow,
  LockedTagContainer,
  ReallocateLinkButton,
  StyledButton,
  StyledSecondaryButton
} from "./Header.styles"
import LockStatusTag from "./LockStatusTag"
import { LinkButton } from "../../components/Buttons/LinkButton"

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

  const caseIsViewOnly = !isLockedByCurrentUser(currentUser.username, courtCase)
  const hasCaseLock = isLockedByCurrentUser(currentUser.username, courtCase)

  return (
    <CaseDetailHeaderContainer id="case-detail-header">
      <CaseDetailHeaderRow id="case-detail-header-row">
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
        <LockedTagContainer id="locked-tag-container">
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
        <ButtonContainer>
          <ConditionalRender isRendered={canReallocate && courtCase.phase === 1 && !pathName.includes("/reallocate")}>
            <ReallocateLinkButton href={reallocatePath} className="b7-reallocate-button" secondary={true}>
              {"Reallocate Case"}
            </ReallocateLinkButton>
          </ConditionalRender>
          <ConditionalRender isRendered={hasCaseLock}>
            <LinkButton id="leave-and-lock" href={basePath}>
              {"Leave and lock"}
            </LinkButton>
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
      </CaseDetailHeaderRow>

      <CourtCaseDetailsSummaryBox />
    </CaseDetailHeaderContainer>
  )
}

export default Header
