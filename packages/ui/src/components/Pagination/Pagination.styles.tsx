import styled from "styled-components"

const PaginationBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 99%;
  margin-top: 15px;

  @media screen and (max-width: 1680px) {
    display: grid;
    grid-template-columns: repeat(3, auto);

    .top-refresh-container,
    .bottom-refresh-container {
      grid-column: 1 / span 3;
    }
  }
`

export { PaginationBar }
