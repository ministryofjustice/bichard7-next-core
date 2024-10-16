import ActionLink from "components/ActionLink"
import Badge, { BadgeColours } from "components/Badge"
import Checkbox from "components/Checkbox"
import ConditionalRender from "components/ConditionalRender"
import { Preview } from "components/Preview"
import PreviewButton from "components/PreviewButton"
import { GridCol, GridRow, Heading, Paragraph } from "govuk-react"
import { ChangeEvent, SyntheticEvent, useState } from "react"
import { DisplayTrigger } from "types/display/Triggers"
import getTriggerDefinition from "utils/getTriggerDefinition"
import {
  CjsResultCode,
  TriggerCodeLabel,
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
      <TriggerHeaderRow className={`trigger-header trigger-header-row`}>
        <GridCol className="trigger-details-column" setWidth="85%">
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
        </GridCol>
        <GridCol setWidth="15%">
          <TriggerStatus>
            <ConditionalRender isRendered={isResolved}>
              <TriggerCompleteBadge />
            </ConditionalRender>
            <ConditionalRender isRendered={!disabled && !isResolved}>
              <Checkbox
                id={checkBoxId}
                value={trigger.triggerId}
                checked={selectedTriggerIds.includes(trigger.triggerId)}
                onChange={setTriggerSelection}
              />
            </ConditionalRender>
          </TriggerStatus>
        </GridCol>
      </TriggerHeaderRow>
      <GridRow>
        <GridCol>
          <TriggerDefinition>{triggerDefinition?.description}</TriggerDefinition>
          <PreviewButton
            className="triggers-help-preview"
            showPreview={!showHelpBox}
            previewLabel="More information"
            onClick={() => setShowHelpBox(!showHelpBox)}
          />
        </GridCol>
      </GridRow>
      <GridRow>
        <GridCol>
          <ConditionalRender isRendered={showHelpBox}>
            <Preview className="triggers-help">
              <Heading as="h3" size="SMALL">
                {"PNC screen to update"}
              </Heading>
              <Paragraph supportingText={true}>{triggerDefinition?.pncScreenToUpdate ?? "Trigger not found"}</Paragraph>
              <Heading as="h3" size="SMALL">
                {"CJS result code"}
              </Heading>
              <CjsResultCode
                className={"cjs-result-code"}
                dangerouslySetInnerHTML={{ __html: triggerDefinition?.cjsResultCode ?? "" }}
              ></CjsResultCode>
            </Preview>
          </ConditionalRender>
        </GridCol>
      </GridRow>
    </TriggerContainer>
  )
}

export default Trigger
