import Permission from "@moj-bichard7/common/types/Permission"
import Badge, { BadgeColours } from "components/Badge"
import { LinkButton } from "components/Buttons"
import ConditionalRender from "components/ConditionalRender"
import Form from "components/Form"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { usePreviousPath } from "context/PreviousPathContext"
import ResolutionStatusBadge from "features/CourtCaseList/tags/ResolutionStatusBadge"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { DisplayFullCourtCase } from "types/display/CourtCases"
import { isLockedByCurrentUser } from "utils/caseLocks"
import { formatDisplayedDate } from "utils/date/formattedDate"
import getResolutionStatus from "utils/getResolutionStatus"
import { FlexContainer, SummaryBox, SummaryBoxGrid } from "./CourtCaseDetailsSummaryBox.styles"
import CourtCaseDetailsSummaryBoxField from "./CourtCaseDetailsSummaryBoxField"
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
const CourtCaseDetailsSummaryBox: React.FC<Props> = ({ canReallocate }: Props) => {
  const { courtCase } = useCourtCase()
  const { basePath } = useRouter()
  const { csrfToken } = useCsrfToken()
  const currentUser = useCurrentUser()

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

  const formattedHearingDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.DateOfHearing.toString() || ""
  )
  const formattedDobDate = formatDisplayedDate(
    courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.DefendantDetail?.BirthDate?.toString() ??
      ""
  )
  const pncIdentifier = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.PNCIdentifier
  const asn = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant.ArrestSummonsNumber
  const hasCaseLock = isLockedByCurrentUser(courtCase, currentUser.username)
  const caseIsViewOnly = !isLockedByCurrentUser(courtCase, currentUser.username)

  return (
    <SummaryBox className={`govuk-body`} aria-label="Court case summary">
      <h1 className="hidden-header govuk-heading-l">{"Case details"}</h1>
      <FlexContainer>
        <h2>
          {courtCase.defendantName}
          {<ResolutionStatusBadge resolutionStatus={getResolutionStatus(courtCase)} />}
          <Badge
            isRendered={caseIsViewOnly}
            label="View only"
            colour={BadgeColours.Blue}
            className="govuk-!-static-margin-left-5 view-only-badge moj-badge--large"
          />
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
        </h2>

        <ButtonContainer>
          <ConditionalRender isRendered={canReallocate && courtCase.phase === 1 && !pathName.includes("/reallocate")}>
            <LinkButton href={reallocatePath} className="b7-reallocate-button" secondary={true}>
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
      </FlexContainer>
      <SummaryBoxGrid>
        <CourtCaseDetailsSummaryBoxField label="PTIURN" value={courtCase.ptiurn} />
        <CourtCaseDetailsSummaryBoxField label="ASN" value={asn} />
        <CourtCaseDetailsSummaryBoxField label="PNCID" value={pncIdentifier} />
        <CourtCaseDetailsSummaryBoxField label="DOB" value={formattedDobDate} />
        <CourtCaseDetailsSummaryBoxField label="Hearing date" value={formattedHearingDate} />
        <CourtCaseDetailsSummaryBoxField
          label="Court code (LJA)"
          value={courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Hearing.CourtHouseCode.toString()}
        />
        <CourtCaseDetailsSummaryBoxField label="Court name" value={courtCase.courtName} courtName={true} />
      </SummaryBoxGrid>
    </SummaryBox>
  )
}

export default CourtCaseDetailsSummaryBox
