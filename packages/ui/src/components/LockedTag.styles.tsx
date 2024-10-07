import styled from "styled-components"

const Lockee = styled.span`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > img {
    margin-right: 5px;
    margin-bottom: 20px;
  }
`

const LockedTagContainer = styled.div`
  display: flex;
  justify-content: end;
`

export { LockedTagContainer, Lockee }
