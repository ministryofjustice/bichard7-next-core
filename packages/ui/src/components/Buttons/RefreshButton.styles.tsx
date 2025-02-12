import styled from "styled-components"
import { yellow } from "utils/colours"

export const RefreshButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 10px;

  span {
    display: flex;
    align-self: anchor-center;
    margin-bottom: 0;
    color: #505a5f;
  }
`

export const StyledRefreshButton = styled.button`
  display: flex;
  font-family: "GDS Transport";
  background-color: white;
  border-color: #1759bc;
  color: #1759bc;
  font-size: 1rem;
  line-height: 1.25;
  padding: 8px 10px 7px 6px;
  margin-right: 10px;
  text-align: center;
  vertical-align: top;
  cursor: pointer;
  border-width: 1px;
  border-radius: 2px;
  height: 38px;

  img {
    display: flex;
    align-self: end;
    margin-right: 5px;
  }

  &:focus {
    background-color: ${yellow};
  }

  &:hover,
  &:active {
    background-color: rgba(23, 89, 188, 0.1);
  }
`
