import Permission from "@moj-bichard7/common/types/Permission"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { usePreviousPath } from "context/PreviousPathContext"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"

import { AccordionToggle } from "components/Card/Card.styles"
import { useState } from "react"
import { isLockedByCurrentUser } from "services/case"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { LinkButton } from "../../components/Buttons/LinkButton"
import Form from "../../components/Form"
import getResolutionStatus from "../../utils/getResolutionStatus"
import ResolutionStatusBadge from "../CourtCaseList/tags/ResolutionStatusBadge"
import CourtCaseDetailsSummaryBox from "./CourtCaseDetailsSummaryBox"
import {
  ButtonContainer,
  CaseDetailHeaderContainer,
  CaseDetailHeaderRow,
  CaseDetailsHeader,
  LockedTagContainer,
  SecondaryLinkButton,
  StyledButton
} from "./Header.styles"
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isContentVisible, setIsContentVisible] = useState(true)

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

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  const toggleContentVisibility = () => setIsContentVisible((previousValue) => !previousValue)

  return (
    <CaseDetailHeaderContainer id="case-detail-header">
      <CaseDetailHeaderRow id="case-detail-header-row">
        <CaseDetailsHeader>
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

          <AccordionToggle
            className={"govuk-accordion__summary-box"}
            onClick={toggleContentVisibility}
            aria-expanded={isContentVisible}
          >
            <span className="govuk-accordion__section-toggle-focus">
              <span
                className={`govuk-accordion-nav__chevron ${!isContentVisible ? "govuk-accordion-nav__chevron--down" : ""}`}
              ></span>
              <span className="govuk-accordion__section-toggle-text">{isContentVisible ? "Hide" : "Show"}</span>
            </span>
          </AccordionToggle>
        </CaseDetailsHeader>
        <ButtonContainer>
          <ConditionalRender isRendered={canReallocate && !pathName.includes("/reallocate")}>
            <SecondaryLinkButton
              href={reallocatePath}
              className="b7-reallocate-button"
              secondary={true}
              canBeDisabled={true}
            >
              {"Reallocate Case"}
            </SecondaryLinkButton>
          </ConditionalRender>
          <ConditionalRender isRendered={hasCaseLock}>
            <LinkButton id="leave-and-lock" href={basePath} canBeDisabled={true}>
              {"Leave and lock"}
            </LinkButton>
            <Form method="post" action={leaveAndUnlockUrl} csrfToken={csrfToken} onSubmit={handleSubmit}>
              <StyledButton id="leave-and-unlock" className={`button`} type="submit" disabled={isSubmitting}>
                {"Leave and unlock"}
              </StyledButton>
            </Form>
          </ConditionalRender>
          <ConditionalRender isRendered={!hasCaseLock}>
            <SecondaryLinkButton id="return-to-case-list" className={`button`} href={basePath} secondary={true}>
              {"Return to case list"}
            </SecondaryLinkButton>
          </ConditionalRender>
        </ButtonContainer>
      </CaseDetailHeaderRow>

      {isContentVisible && <CourtCaseDetailsSummaryBox />}
    </CaseDetailHeaderContainer>
  )
}

export default Header
