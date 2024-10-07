import { Input } from "govuk-react"
import styled from "styled-components"

const OffenceDetailsContainer = styled.div`
  & td {
    width: 50%;
  }
`

const PncInput = styled(Input)`
  width: 4.125rem;
`

export { OffenceDetailsContainer, PncInput }
