import styled, { css } from "styled-components"

const accordionCss = css`
  margin-bottom: 0;
  padding: 0;
  border: none;
`

const AccordionHeader = styled.div`
  ${accordionCss}
`

const AccordionHeading = styled.h2`
  ${accordionCss}
`

const AccordionButton = styled.button`
  ${accordionCss}
`

const AccordionToggle = styled.span`
  ${accordionCss}
`

const AccordionContent = styled.div`
  margin-top: 0.75rem;
  margin-bottom: 0.5rem;
`

export { AccordionButton, AccordionContent, AccordionHeader, AccordionHeading, AccordionToggle }
