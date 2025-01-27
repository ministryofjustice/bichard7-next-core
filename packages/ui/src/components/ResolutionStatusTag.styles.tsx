import styled from "styled-components"

const ResolutionTag = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;

  & > img {
    margin-right: 5px;
    margin-bottom: 20px;
  }
`

const ResolutionStatusTagContainer = styled.div`
  display: flex;
  justify-content: end;
`

export { ResolutionStatusTagContainer, ResolutionTag }
