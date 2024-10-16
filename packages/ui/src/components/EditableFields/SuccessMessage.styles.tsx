import styled from "styled-components"
import { gdsGreen } from "utils/colours"
import { gdsTransport, arial, sansSerif } from "utils/typography"

const SuccessMessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`
const Message = styled.span`
  font-family: ${gdsTransport}, ${arial}, ${sansSerif};
  font-size: 20px;
  color: ${gdsGreen};
`

export { SuccessMessageContainer, Message }
