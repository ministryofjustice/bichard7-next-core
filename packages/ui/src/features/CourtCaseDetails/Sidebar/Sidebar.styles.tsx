import { Tabs } from "govuk-react"
import styled from "styled-components"

const SidebarContainer = styled.div`
  margin-top: -41px;

  li > a {
    cursor: pointer;
    font-weight: bold;
  }
`

const UnpaddedPanel = styled(Tabs.Panel)`
  padding: 0;
`

export { SidebarContainer, UnpaddedPanel }
