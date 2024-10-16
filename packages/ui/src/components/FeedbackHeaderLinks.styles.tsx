import styled from "styled-components"
import { gdsBlack } from "utils/colours"
import { nta, arial, sansSerif } from "utils/typography"

const LinksRow = styled.div`
  display: flex;
  align-items: center;
`

const BackLinkWrapper = styled.div`
  flex: 1;
`

const SkipLink = styled.button`
  flex: 1;
  cursor: pointer;
  background: transparent;
  border: none;
  font-family: ${nta}, ${arial}, ${sansSerif};
  font-size: 1em;
  position: relative;
  line-height: 1.25;

  &::before {
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-color: transparent;
    -webkit-clip-path: polygon(0% 50%, 100% 100%, 100% 0%);
    -webkit-clip-path: polygon(0% 50%, 100% 100%, 100% 0%);
    clip-path: polygon(0% 50%, 100% 100%, 100% 0%);
    border-width: 5px 6px 5px 0;
    border-right-color: inherit;
    content: "";
    position: absolute;
    top: -1px;
    bottom: 1px;
    right: -8px;
    margin: auto;
    transform: rotate(180deg);
  }

  &::after {
    content: "";
    position: absolute;
    height: 1px;
    width: 100%;
    bottom: 0;
    left: 6px;
    background-color: ${gdsBlack};
  }
`

export { BackLinkWrapper, LinksRow, SkipLink }
