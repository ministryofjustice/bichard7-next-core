import styled from "styled-components"

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  width: 99%;
  margin-top: 15px;

  .top-refresh-container,
  .bottom-refresh-container {
    justify-self: flex-start;
    align-self: flex-start;
    height: 50px;

    button {
      margin-top: 7px;
    }
  }

  div.pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  @media screen and (max-width: 1680px) {
    display: block;

    .top-refresh-container,
    .bottom-refresh-container {
      justify-self: flex-start;
      align-self: flex-start;
      margin-right: auto;
    }

    div.pagination-controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
`

export { PaginationBar }
