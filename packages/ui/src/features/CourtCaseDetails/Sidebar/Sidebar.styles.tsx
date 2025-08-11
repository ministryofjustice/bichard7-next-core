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
`

export { SidebarContainer, TabHeaders }
