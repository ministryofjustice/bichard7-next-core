import styled from "styled-components"

const SelectAllTriggersGridRow = styled.div`
  text-align: right;
  padding-bottom: 20px;
  cursor: pointer;
  font-size: 1em;
`

const MarkCompleteGridCol = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 0;

  @media (max-width: 768px) {
    .govuk-button {
      font-size: 1rem;
    }
  }
`

const LockStatus = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 0;
`

export { LockStatus, MarkCompleteGridCol, SelectAllTriggersGridRow }
