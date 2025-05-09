import ActionLink from "components/ActionLink"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import { Preview } from "components/Preview"
import PreviewButton from "components/PreviewButton"
import { ChangeEvent, SyntheticEvent, useState } from "react"
import { DisplayTrigger } from "types/display/Triggers"
import getTriggerDefinition from "utils/getTriggerDefinition"
import {
  CjsResultCode,
  TriggerCodeLabel,
  TriggerCol,
  TriggerContainer,
  TriggerDefinition,
  TriggerHeaderRow,
  TriggerStatus
} from "./Trigger.styles"

interface Props {
  trigger: DisplayTrigger
  onClick: (index: number | undefined) => void
  selectedTriggerIds: number[]
  setTriggerSelection: (event: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
}

const TriggerCompleteBadge = () => <Badge isRendered={true} colour={BadgeColours.Green} label={"Complete"} />

const Trigger = ({ trigger, onClick, selectedTriggerIds, setTriggerSelection, disabled }: Props) => {
  const triggerDefinition = getTriggerDefinition(trigger.triggerCode)
  const [showHelpBox, setShowHelpBox] = useState(false)

  const checkBoxId = `trigger_${trigger.triggerId}`
  const isResolved = trigger.status === "Resolved"

  return (
    <TriggerContainer key={trigger.triggerId} className={`moj-trigger-row trigger-container`}>
      <TriggerHeaderRow className={`govuk-grid-row trigger-header trigger-header-row`}>
        <TriggerCol className="govuk-grid-column-three-quarters trigger-details-column" width="85%">
          <TriggerCodeLabel className={`trigger-code trigger-code`} htmlFor={checkBoxId}>
            {trigger.shortTriggerCode}
          </TriggerCodeLabel>
          {(trigger.triggerItemIdentity ?? 0) > 0 && (
            <>
              <b>{" / "}</b>
              <ActionLink
                onClick={(event: SyntheticEvent) => {
                  event.preventDefault()
                  onClick(trigger.triggerItemIdentity)
                }}
              >
                {"Offence "} {trigger.triggerItemIdentity}
              </ActionLink>
            </>
          )}
        </TriggerCol>
        <TriggerCol className="govuk-grid-column-one-quarter" width="15%">
          <TriggerStatus>
            <ConditionalRender isRendered={isResolved}>
              <TriggerCompleteBadge />
            </ConditionalRender>
            <ConditionalRender isRendered={!disabled && !isResolved}>
              <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                <div className="govuk-checkboxes__item">
                  <input
                    className="govuk-checkboxes__input"
                    id={checkBoxId}
                    type="checkbox"
                    value={trigger.triggerId}
                    checked={selectedTriggerIds.includes(trigger.triggerId)}
                    onChange={setTriggerSelection}
                  ></input>
                  <label className="govuk-label govuk-checkboxes__label" htmlFor={checkBoxId}>
                    {}
                  </label>
                </div>
              </div>
            </ConditionalRender>
          </TriggerStatus>
        </TriggerCol>
      </TriggerHeaderRow>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <TriggerDefinition width={"90%"}>{triggerDefinition?.description}</TriggerDefinition>
          <PreviewButton
            className="triggers-help-preview"
            showPreview={!showHelpBox}
            previewLabel="More information"
            onClick={() => setShowHelpBox(!showHelpBox)}
            ariaControls="trigger-preview"
          />
        </div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-full">
          <ConditionalRender isRendered={showHelpBox}>
            <Preview id={"rigger-preview"} className="triggers-help" aria-hidden={!showHelpBox}>
              <h3 className="govuk-heading-s">{"PNC screen to update"}</h3>
              <p className="govuk-body-s">{triggerDefinition?.pncScreenToUpdate ?? "Trigger not found"}</p>
              <h3 className="govuk-heading-s">{"CJS result code"}</h3>
              <CjsResultCode
                className={"cjs-result-code"}
                dangerouslySetInnerHTML={{ __html: triggerDefinition?.cjsResultCode ?? "" }}
              ></CjsResultCode>
            </Preview>
          </ConditionalRender>
        </div>
      </div>
    </TriggerContainer>
  )
}

export default Trigger
