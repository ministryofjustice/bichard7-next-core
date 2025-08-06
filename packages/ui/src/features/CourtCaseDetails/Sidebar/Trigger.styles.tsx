import styled from "styled-components"
import { breakpoints } from "types/breakpoints"

const TriggerContainer = styled.div`
  font-size: var(--case-details-default-font-size);

  &:first-child {
    margin-top: 20px;
  }
  &:not(:last-child) {
    margin-bottom: 30px;
  }

  @media (max-width: ${breakpoints.compact}) {
    .govuk-checkboxes__input {
      width: 30px;
      height: 30px;
    }

    .govuk-checkboxes__label::before {
      width: 30px;
      height: 30px;
    }

    .govuk-checkboxes__label::after {
      top: 8px;
      left: 6px;
    }
  }
`

const TriggerHeaderRow = styled.div`
  max-height: 25px;
  display: flex;
`

const TriggerCol = styled.div<{ width: string }>`
  width: ${(props) => props.width};
`

const TriggerCodeLabel = styled.label`
  font-weight: bold;
`

const CjsResultCode = styled.div`
  font-size: 1em;
  line-height: 1.25;
`

const TriggerDefinition = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  margin-top: 10px;
`

const TriggerStatus = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`

export {
  CjsResultCode,
  TriggerCodeLabel,
  TriggerCol,
  TriggerContainer,
  TriggerDefinition,
  TriggerHeaderRow,
  TriggerStatus
}
