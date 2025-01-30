import styled from "styled-components"
import { textSecondary } from "utils/colours"

const StyledDetails = styled.details`
  margin-bottom: 20px;
`

const DisposalDetails = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  & > * {
    flex-basis: 31%;

    :not(:last-child) {
      margin-right: 2%;
    }
  }
`

const DisposalText = styled.div`
  margin-top: 15px;

  .disposal-text {
    font-size: 16px;
    margin-bottom: 0;
  }

  .disposal-text-absent {
    color: ${textSecondary};
  }
`

export { DisposalDetails, DisposalText, StyledDetails }
