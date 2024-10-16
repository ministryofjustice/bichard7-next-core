import styled from "styled-components"
import { darkGrey } from "utils/colours"

const IndeterminateCheckboxWrapper = styled.div`
  display: flex;
  width: 100%;

  .govuk-checkboxes__input:indeterminate + .govuk-checkboxes__label::after {
    transform: rotate(0);
    border: none;
    top: 0;
    bottom: 0;
    left: 5px;
    margin: auto;
    height: 3px;
    width: 14px;
    background: currentColor;
    opacity: 1;
    color: ${darkGrey};
  }

  .govuk-checkboxes__input:indeterminate + .govuk-checkboxes__label::before {
    border-color: ${darkGrey};
  }
`

export { IndeterminateCheckboxWrapper }
