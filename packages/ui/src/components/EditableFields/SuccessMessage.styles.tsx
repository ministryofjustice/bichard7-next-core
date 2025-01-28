import styled from "styled-components"
import { gdsGreen } from "utils/colours"

const SuccessMessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`
const Message = styled.span`
  font-size: 20px;
  color: ${gdsGreen};
`

export { Message, SuccessMessageContainer }
