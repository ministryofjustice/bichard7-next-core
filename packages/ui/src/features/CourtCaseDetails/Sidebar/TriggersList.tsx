import ActionLink from "components/ActionLink"
import { Button } from "components/Buttons/Button"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { sortBy } from "lodash"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { ChangeEvent, SyntheticEvent, useState } from "react"
import { triggersAreLockedByAnotherUser } from "services/case"
import { DisplayTrigger } from "types/display/Triggers"
import type NavigationHandler from "types/NavigationHandler"
import { updateQueryWithoutResubmitCase } from "utils/updateQueryWithoutResubmitCase"
import Form from "../../../components/Form"
import { updateTabLink } from "../../../utils/updateTabLink"
import LockStatusTag from "../LockStatusTag"
import Trigger from "./Trigger"
import { LockStatus, MarkCompleteGridCol, SelectAllTriggersGridRow } from "./TriggersList.styles"

interface Props {
  onNavigate: NavigationHandler
}

const TriggersList = ({ onNavigate }: Props) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()
  const router = useRouter()

  const [selectedTriggerIds, setSelectedTriggerIds] = useState<number[]>([])
  const { basePath, query } = useRouter()

  const triggers: DisplayTrigger[] = sortBy(courtCase.triggers, "triggerItemIdentity")
  const hasTriggers = triggers.length > 0
  const hasUnresolvedTriggers = triggers.filter((t) => t.status === "Unresolved").length > 0
  const triggersLockedByAnotherUser = triggersAreLockedByAnotherUser(currentUser.username, courtCase)
  const { csrfToken } = useCsrfToken()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setTriggerSelection = ({ target: checkbox }: ChangeEvent<HTMLInputElement>) => {
    const triggerId = parseInt(checkbox.value, 10)
    const isSelected = checkbox.checked
    if (isSelected) {
      setSelectedTriggerIds([...selectedTriggerIds, triggerId])
    } else {
      setSelectedTriggerIds(selectedTriggerIds.filter((id) => id !== triggerId))
    }
  }

  const selectAll = (event: SyntheticEvent) => {
    event.preventDefault()
    setSelectedTriggerIds(
      courtCase.triggers.filter((trigger) => trigger.status === "Unresolved").map((trigger) => trigger.triggerId)
    )
  }

  const handleClick = (offenceOrderIndex?: number) => {
    updateTabLink(router, "Offences")
    onNavigate({ location: "Case Details > Offences", args: { offenceOrderIndex } })
  }

  const resolveTriggerUrl = (triggerIds: number[]) => {
    const resolveQuery = { ...query, resolveTrigger: triggerIds.map((id) => id.toString()), courtCaseId: undefined }

    // Delete the `courtCaseId` param, which comes from the URL dynamic router, not the query string
    const filteredQuery = Object.fromEntries(Object.entries(resolveQuery).filter(([key]) => key !== "courtCaseId"))

    return updateQueryWithoutResubmitCase(basePath, `/court-cases/${courtCase.errorId}?${encode(filteredQuery)}`)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
  }

  return (
    <Form method="post" onSubmit={handleSubmit} action={resolveTriggerUrl(selectedTriggerIds)} csrfToken={csrfToken}>
      {!hasTriggers && "There are no triggers for this case."}
      <ConditionalRender isRendered={hasUnresolvedTriggers && !triggersLockedByAnotherUser}>
        <SelectAllTriggersGridRow className="govuk-grid-row" id={"select-all-triggers"}>
          <div className="govuk-grid-column-full">
            <ActionLink onClick={selectAll} id="select-all-action">
              {"Select all"}
            </ActionLink>
          </div>
        </SelectAllTriggersGridRow>
      </ConditionalRender>
      <div className={"trigger-rows"}>
        {triggers.map((trigger) => (
          <Trigger
            key={trigger.triggerId}
            trigger={trigger}
            disabled={triggersLockedByAnotherUser}
            onClick={() => handleClick(trigger.triggerItemIdentity)}
            selectedTriggerIds={selectedTriggerIds}
            setTriggerSelection={setTriggerSelection}
          />
        ))}
      </div>

      <ConditionalRender isRendered={hasTriggers && !triggersLockedByAnotherUser}>
        <div className="govuk-grid-row">
          <MarkCompleteGridCol className="govuk-grid-column-full">
            <Button
              type="submit"
              disabled={selectedTriggerIds.length === 0 || isSubmitting}
              id="mark-triggers-complete-button"
            >
              {"Mark trigger(s) as complete"}
            </Button>
          </MarkCompleteGridCol>
        </div>
      </ConditionalRender>

      <ConditionalRender isRendered={hasTriggers}>
        <LockStatus>
          <LockStatusTag
            isRendered={triggers.length > 0 && courtCase.triggerStatus !== null}
            resolutionStatus={courtCase.triggerStatus}
            lockName="Triggers"
          />
        </LockStatus>
      </ConditionalRender>
    </Form>
  )
}

export default TriggersList
