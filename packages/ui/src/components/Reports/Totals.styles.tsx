import styled from "styled-components"

interface TotalContainerProps {
  $flat: boolean
}

export const TotalsContainer = styled.div<TotalContainerProps>`
  display: inline-block;
  padding-left: 1.875rem;
  margin-bottom: ${(props) => (props.$flat ? "1rem" : 0)};

  > strong {
    padding-right: 1.875rem;
  }

  span {
    margin-left: 0.9375rem;
    margin-right: 0.9375rem;
  }
`
