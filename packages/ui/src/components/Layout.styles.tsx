import styled from "styled-components"
import { gdsMidGrey } from "utils/colours"

const Banner = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${gdsMidGrey};
  margin-bottom: 0.7rem;

  > .govuk-phase-banner {
    border: none;
  }
`

const Box = styled.div`
  background-color: #005bbb;
  color: white;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  font-weight: bold;

  > .govuk-phase-banner__text {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  svg {
    flex-shrink: 0;
    display: block;
  }

  a {
    color: #ffffff;
    text-decoration: underline;
    font-weight: normal;
  }

  a:hover {
    text-decoration: none;
  }
`

export { Banner, Box }
