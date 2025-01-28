import styled from "styled-components"

const SwitchingFeedbackButtonContainer = styled.div`
  display: flex;
  padding-top: 15px;

  form {
    margin-top: 5px;
    margin-left: 20px;
  }
`

const SkipLink = styled.button`
  flex: 1;
  cursor: pointer;
  background: transparent;
  border: none;
  font-size: 1em;
  position: relative;
  line-height: 1.25;
  text-decoration: underline;
  text-underline-offset: 3px;

  @media (min-width: 40.0625em) {
    font-size: 1.1875rem;
    line-height: 1.3157894737;
  }
`

export { SkipLink, SwitchingFeedbackButtonContainer }
