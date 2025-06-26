import styled from "styled-components"

const MojHeaderContainer = styled.div`
  max-width: 100%;
  padding: 0 40px;

  @media (max-width: 1019px) {
    padding: 0;
  }
`

const HeaderContainer = styled.div`
  margin-top: 30px;
`

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 10px 10px 10px 0;
  padding: 10px 10px 10px 0;
`

export { HeaderContainer, HeaderRow, MojHeaderContainer }
