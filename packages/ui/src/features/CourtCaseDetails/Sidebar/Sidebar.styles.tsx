import styled from "styled-components"

const SidebarContainer = styled.div`
  margin-top: -41px;

  li > a {
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
  }

  .govuk-button {
    width: auto;
    font-size: 1.1875rem;
  }

  #pnc-details {
    padding: 0;
  }
`

const TabHeaders = styled.ul`
  display: flex;
  flex-wrap: nowrap;
`

export { SidebarContainer, TabHeaders }
