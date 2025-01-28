import styled from "styled-components"

const NotesTableContainer = styled.div`
  max-height: 368px;
  overflow: auto;
`

const ShowMoreContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 15px;
  margin-top: 15px;
`

const ReallocationContainer = styled.div`
  @media (min-width: 1024px) {
    width: 50%;
  }

  @media (min-width: 1280px) {
    width: 66.6666666667%;
  }
`

const UserNotesContainer = styled.div`
  @media (min-width: 1024px) {
    width: 50%;
  }

  @media (min-width: 1280px) {
    width: 33.3333333333%;
  }
`

export { NotesTableContainer, ShowMoreContainer, ReallocationContainer, UserNotesContainer }
