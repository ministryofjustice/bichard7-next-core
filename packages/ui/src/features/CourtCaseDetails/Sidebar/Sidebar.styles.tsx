import styled from "styled-components"

const SidebarContainer = styled.div`
  margin-top: -41px;

  #pnc-details {
    padding: 0;
  }
`

const TabHeaders = styled.ul`
  display: flex;
  flex-wrap: nowrap;

  li {
    flex: 1;
  }

  li > a {
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
  }

  .govuk-tabs__list-item {
    margin-bottom: 5px;
  }

  .govuk-tabs__list-item--selected {
    margin-bottom: 0;
  }
`

export { SidebarContainer, TabHeaders }
