import styled from "styled-components"

const Banner = styled.div`
  background-color: #005bbb;
  color: white;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  margin-bottom: 0.7rem;

  > .govuk-phase-banner__text {
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
    color: #ffffff;
    text-decoration: underline;
    font-weight: normal;
  }

  a:hover {
    text-decoration: none;
  }
`

export { Banner }
