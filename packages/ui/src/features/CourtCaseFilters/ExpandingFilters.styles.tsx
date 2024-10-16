import styled from "styled-components"
import { blue, grey } from "utils/colours"

const Legend = styled.div`
  color: ${blue};
`

const LegendContainer = styled.div`
  margin-top: 8px;
`

const IconButton = styled.button`
  border: 3px solid transparent;
  background-color: transparent;
  &:active {
    background-color: ${grey};
  }
`

const Container = styled.div`
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

export { Container, IconButton, Legend, LegendContainer }
