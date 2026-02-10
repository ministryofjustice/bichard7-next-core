import styled from "styled-components"
import { gdsDarkGreen, gdsMidGrey, gdsRed, textSecondary, white } from "../utils/colours"

const GDS_FONT_STACK = '"GDS Transport", arial, sans-serif'

const statusColorMap = {
  pass: gdsDarkGreen,
  fail: gdsRed,
  remaining: gdsMidGrey
} as const

export const CardRow = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
`

export const StatCard = styled.div<{ $variant: keyof typeof statusColorMap }>`
  flex: 1;
  padding: 15px;
  background: ${white};
  border: 1px solid ${gdsMidGrey};
  border-top: 5px solid ${(props) => statusColorMap[props.$variant]};
`

export const CardValue = styled.span`
  display: block;
  font-size: 24px;
  font-weight: bold;
  font-family: ${GDS_FONT_STACK};
  line-height: 1;
  margin-bottom: 5px;
`

export const CardLabel = styled.span`
  display: block;
  font-size: 16px;
  color: ${textSecondary};
  font-family: ${GDS_FONT_STACK};
`
