import styled from "styled-components"

export const AuditCaseListContainer = styled.div`
  overflow: auto;

  table {
    tbody {
      tr td:last-child {
        padding-right: 10px;
      }
      tr td:first-child {
        padding-left: 10px;
      }
    }
  }
`
