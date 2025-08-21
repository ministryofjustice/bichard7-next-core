import styled from "styled-components"
import { gdsMidGrey } from "../../utils/colours"

export const StyledTabs = styled.div`
  .govuk-tabs__panel {
    border: 1px solid ${gdsMidGrey};
    border-top: none;
    padding: 30px 20px;
  }

  .govuk-tabs__panel--hidden {
    display: none;
  }
`
