import styled from "styled-components"

const TriggerGroupList = styled.div`
  visibility: ${(props) => (props.hidden ? "hidden" : "visible")};
  margin-left: 25px;
`

export { TriggerGroupList }
