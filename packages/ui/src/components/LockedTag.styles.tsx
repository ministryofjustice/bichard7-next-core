import styled from "styled-components"
import { TagContainerCss, TagCss } from "./Tag.styles"

const Lockee = styled.span`
  ${TagCss}
`

const LockedTagContainer = styled.div`
  ${TagContainerCss}
`

export { LockedTagContainer, Lockee }
