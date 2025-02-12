import styled from "styled-components"

const StyledAppliedFilters = styled.div`
  margin-top: 0;

  ul.moj-filter-tags {
    margin-top: 20px;
    margin-bottom: 0;
  }
`

const ButtonMenu = styled.div`
  width: 100%;
`

const CaseListButtons = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const CourtCaseListPane = styled.div`
  overflow: auto;
`

export { ButtonMenu, CaseListButtons, CourtCaseListPane, StyledAppliedFilters }
