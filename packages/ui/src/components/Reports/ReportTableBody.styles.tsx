import styled from "styled-components"
import { TableBody } from "components/Table"
import { lightGrey } from "utils/colours"

export const StyledReportTableBody = styled(TableBody)`
  tr:nth-child(odd) {
    background-color: ${lightGrey};
  }
`
