import styled from "styled-components"

const AttentionContainer = styled.div`
  margin-top: 0.3rem;
  max-width: calc(100% - 8px);
  padding-right: 0;
  & > .govuk-tag {
    padding-left: 0;
    padding-right: 8px;
  }
`

const AttentionBanner = styled.div`
  text-transform: none;
  font-weight: 300;
  max-width: 100%;
`

export { AttentionBanner, AttentionContainer }
