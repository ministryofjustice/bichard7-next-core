import styled from "styled-components"

const StyledNav = styled.nav<{ width: string }>`
  width: ${(props) => props.width};
`

export { StyledNav }
