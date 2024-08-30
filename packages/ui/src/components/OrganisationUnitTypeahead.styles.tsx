import styled from "styled-components"

const ListWrapper = styled.div`
  max-height: 20rem;
  overflow-y: scroll;
  background: white;
  width: 100%;

  ul {
    margin-top: 0;
    padding-left: 0;
    margin-bottom: 0;
  }

  li {
    list-style: none;
    padding: 10px;
    border: 1px gray solid;
    position: relative;
  }

  span {
    padding-top: 0px;
    display: block;
    font-size: 1em;
  }
`

export { ListWrapper }
