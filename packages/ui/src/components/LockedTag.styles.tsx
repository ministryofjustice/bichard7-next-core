import styled from "styled-components"
import { breakpoints } from "types/breakpoints"

const Lockee = styled.span`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > img {
    margin-right: 5px;
  }
`

const LockedTagContainer = styled.div`
  display: flex;
  justify-content: end;
  font-size: 1.1875rem;
  margin-bottom: 20px;

  @media (max-width: ${breakpoints.regular}) {
    font-size: 1rem;
  }
`

export { LockedTagContainer, Lockee }
