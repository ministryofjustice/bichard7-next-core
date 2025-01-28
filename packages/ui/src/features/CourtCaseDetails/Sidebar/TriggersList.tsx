import ActionLink from "components/ActionLink"
import { Button } from "components/Buttons"
import ConditionalRender from "components/ConditionalRender"
import { useCourtCase } from "context/CourtCaseContext"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { sortBy } from "lodash"
import { useRouter } from "next/router"
import { encode } from "querystring"
import { ChangeEvent, SyntheticEvent, useState } from "react"
import type NavigationHandler from "types/NavigationHandler"
import { triggersAreLockedByAnotherUser } from "utils/caseLocks"
import Form from "../../../components/Form"
import LockStatusTag from "../LockStatusTag"
import Trigger from "./Trigger"
import { LockStatus, MarkCompleteGridCol, SelectAllTriggersGridRow } from "./TriggersList.styles"

interface Props {
  onNavigate: NavigationHandler
}

const TriggersList = ({ onNavigate }: Props) => {
  const currentUser = useCurrentUser()
  const { courtCase } = useCourtCase()

  const [selectedTriggerIds, setSelectedTriggerIds] = useState<number[]>([])
  const { basePath, query } = useRouter()

  const triggers = sortBy(courtCase.triggers, "triggerItemIdentity")
  const hasTriggers = triggers.length > 0
  const hasUnresolvedTriggers = triggers.filter((t) => t.status === "Unresolved").length > 0
  const triggersLockedByAnotherUser = triggersAreLockedByAnotherUser(courtCase, currentUser.username)
  const { csrfToken } = useCsrfToken()

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
    onNavigate({ location: "Case Details > Offences", args: { offenceOrderIndex } })
  }

  const resolveTriggerUrl = (triggerIds: number[]) => {
    const resolveQuery = { ...query, resolveTrigger: triggerIds.map((id) => id.toString()), courtCaseId: undefined }

    // Delete the `courtCaseId` param, which comes from the URL dynamic router, not the query string
    const filteredQuery = Object.fromEntries(Object.entries(resolveQuery).filter(([key]) => key !== "courtCaseId"))

    const url = `${basePath}/court-cases/${courtCase.errorId}?${encode(filteredQuery)}`

    if (url.slice(-1) === "&") {
      return url.slice(0, -1)
    } else {
      return url
    }
  }

  return (
    <Form method="post" action={resolveTriggerUrl(selectedTriggerIds)} csrfToken={csrfToken}>
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
            <Button type="submit" disabled={selectedTriggerIds.length === 0} id="mark-triggers-complete-button">
              {"Mark trigger(s) as complete"}
            </Button>
          </MarkCompleteGridCol>
        </div>
      </ConditionalRender>

      <ConditionalRender isRendered={hasTriggers}>
        <LockStatus>
          <LockStatusTag
            isRendered={triggers.length > 0}
            resolutionStatus={courtCase.triggerStatus}
            lockName="Triggers"
          />
        </LockStatus>
      </ConditionalRender>
    </Form>
  )
}

export default TriggersList
