import styled from "styled-components"
import { gdsBlue, gdsDarkGreen, white } from "../utils/colours"

export const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`

export const ProgressTracker = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: ${gdsBlue};
  height: 15px;
`

export const ProgressFill = styled.div<{ $width: number }>`
  width: ${(props) => props.$width}%;
  background-color: ${gdsDarkGreen};
`

export const ProgressSeparator = styled.div`
  width: 5px;
  background-color: ${white};
`
