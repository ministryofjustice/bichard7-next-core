import styled from "styled-components"

export const DropdownContainer = styled.div`
  display: flex;
  gap: 1rem;

  .govuk-form-group {
    flex: 1;
    select {
      width: 100%;
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
