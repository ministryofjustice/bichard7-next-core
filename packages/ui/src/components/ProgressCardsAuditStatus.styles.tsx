import styled from "styled-components"
import { gdsDarkGreen, gdsMidGrey, gdsRed, white } from "../utils/colours"

const statusColorMap = {
  pass: gdsDarkGreen,
  fail: gdsRed,
  remaining: gdsMidGrey
} as const

export const CardRow = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  margin-bottom: 10px;
  width: 100%;
`

export const StatCard = styled.div<{ $variant: keyof typeof statusColorMap }>`
  flex: 1;
  padding: 15px;
  background: ${white};
  border: 1px solid ${gdsMidGrey};
  border-top: 5px solid ${(props) => statusColorMap[props.$variant]};
`

export const CardCount = styled.span`
  display: block;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 5px;
`
