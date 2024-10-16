import styled from "styled-components"
import { gdsBlack } from "utils/colours"

const LockedByTag = styled.div`
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 5;
`
const LockedByTextSpan = styled.span`
  margin-top: 4;
  margin-bottom: 2;
  padding-left: 10px;
  font-weight: normal;
  color: ${gdsBlack};
  letter-spacing: 0.5px;
  text-transform: none;
`

export { LockedByTag, LockedByTextSpan }
