import styled from "styled-components"
import { lightGrey } from "utils/colours"

const OffenceDetailsContainer = styled.div`
  & td {
    width: 50%;
  }
`

const HeaderWrapper = styled.div`
  background-color: ${lightGrey};
`

export { OffenceDetailsContainer, HeaderWrapper }
