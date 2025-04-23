import styled from "styled-components"
import { gdsBlack, gdsTagBlue } from "utils/colours"

const LockedByTag = styled.div`
  background-color: ${gdsTagBlue};
  color: ${gdsBlack};
  display: inline-flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: 8px 18px 8px 8px;

  span {
    padding-left: 10px;
    text-align: center;
  }
`
export { LockedByTag }
