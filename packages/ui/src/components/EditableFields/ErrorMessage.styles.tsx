import styled from "styled-components"
import { gdsRed } from "utils/colours"
import Image from "next/image"
import { gdsTransport, arial, sansSerif } from "utils/typography"

const ErrorMessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`
const Message = styled.span`
  font-family: ${gdsTransport}, ${arial}, ${sansSerif};
  font-size: 20px;
  color: ${gdsRed};
`

const WarningIcon = styled(Image)`
  display: inline-block;
  vertical-align: bottom;
  margin: -2px 10px 0 0;
`

export { ErrorMessageContainer, Message, WarningIcon }
