import styled from "styled-components"
import { blue, white } from "utils/colours"

const Banner = styled.div`
  background-color: ${blue};
  color: ${white};
  padding: 14px 20px;
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;

  > .info-banner__text {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    font-weight: bold;
  }

  svg {
    flex-shrink: 0;
    display: block;
  }

  a {
    color: ${white};
    text-decoration: underline;
    font-weight: normal;
  }

  a:hover {
    text-decoration: none;
  }
`

const CloseButton = styled.button`
  margin-left: auto;
  width: 20px;
  height: 20px;
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 9px;
    top: 0;
    height: 20px;
    width: 2px;
    background-color: white;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`

export { Banner, CloseButton }
