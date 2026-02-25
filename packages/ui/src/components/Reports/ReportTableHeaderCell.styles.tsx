import styled from "styled-components"
import { TableHeader } from "components/Table"
import { textSecondary, gdsLightGrey } from "utils/colours"

export const StyledReportTableHeaderCell = styled(TableHeader)<{ isGroupHeader?: boolean }>`
  font-size: 16px;
  border-bottom: 1px solid ${textSecondary};
  padding: 10px;
  background-color: ${(props) => (props.isGroupHeader ? gdsLightGrey : "transparent")};
`
