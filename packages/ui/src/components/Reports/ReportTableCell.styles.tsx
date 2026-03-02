import styled from "styled-components"
import { TableCell } from "components/Table"
import { textSecondary } from "utils/colours"

export const StyledReportTableCell = styled(TableCell)`
  font-size: 16px;
  border-bottom: 1px solid ${textSecondary};
  white-space: pre-wrap;
`
