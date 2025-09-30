import styled from "styled-components"

export const DropdownContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;

  .govuk-form-group {
    flex: 1 1 0;
    select {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    width: auto;
    margin-bottom: 15px;
  }
`
