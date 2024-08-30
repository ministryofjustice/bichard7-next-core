import styled from "styled-components"
import { gdsMidGrey, textSecondary } from "utils/colours"

const UpdatedDate = styled.div`
  padding: 15px 20px;
  font-size: 16px;
  color: ${textSecondary};
  border-bottom: solid 1px ${gdsMidGrey};
`

const PncQueryError = styled.div`
  padding: 30px 20px;
`

const CourtCases = styled.div`
  max-height: 80vh;
  overflow-y: scroll;
`

export { CourtCases, PncQueryError, UpdatedDate }
