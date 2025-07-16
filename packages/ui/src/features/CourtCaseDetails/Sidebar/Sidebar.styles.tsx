import styled from "styled-components"

const SidebarContainer = styled.div`
  margin-top: -41px;

  li > a {
    cursor: pointer;
    font-weight: bold;
    text-decoration: none;
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
