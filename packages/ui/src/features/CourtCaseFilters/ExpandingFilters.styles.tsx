import styled from "styled-components"
import { blue, grey } from "utils/colours"

const Legend = styled.div`
  color: ${blue};
`

const LegendContainer = styled.div`
  margin-top: 8px;
`

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1px 6px;
`

const Container = styled.div`
  border: 3px solid transparent;
  margin-left: -10px;
  width: fit-content;
  padding-right: 10px;
  display: flex;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    background-color: ${grey};
  }
  &:active {
    background-color: ${grey};
  }
`

export { Container, Legend, LegendContainer, IconContainer }
