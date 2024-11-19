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
  disabled?: boolean
  onClick: (index: number | undefined) => void
  selectedTriggerIds: number[]
  setTriggerSelection: (event: ChangeEvent<HTMLInputElement>) => void
  trigger: DisplayTrigger
}

const TriggerCompleteBadge = () => <Badge colour={BadgeColours.Green} isRendered={true} label={"Complete"} />

const Trigger = ({ disabled, onClick, selectedTriggerIds, setTriggerSelection, trigger }: Props) => {
  const triggerDefinition = getTriggerDefinition(trigger.triggerCode)
  const [showHelpBox, setShowHelpBox] = useState(false)

  const checkBoxId = `trigger_${trigger.triggerId}`
  const isResolved = trigger.status === "Resolved"

  return (
    <TriggerContainer className={`moj-trigger-row trigger-container`} key={trigger.triggerId}>
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
                checked={selectedTriggerIds.includes(trigger.triggerId)}
                id={checkBoxId}
                onChange={setTriggerSelection}
                value={trigger.triggerId}
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
            onClick={() => setShowHelpBox(!showHelpBox)}
            previewLabel="More information"
            showPreview={!showHelpBox}
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
