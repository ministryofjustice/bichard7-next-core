import { Checkbox as CheckboxGovUK } from "govuk-react"
import styled from "styled-components"

const StyledCheckbox = styled(CheckboxGovUK)`
  & span:before {
    width: 30px;
    height: 30px;
  }
  & span:after {
    top: 7px;
    left: 6px;
    width: 14px;
    height: 6px;
  }
  padding: 0;
`

export { StyledCheckbox }
