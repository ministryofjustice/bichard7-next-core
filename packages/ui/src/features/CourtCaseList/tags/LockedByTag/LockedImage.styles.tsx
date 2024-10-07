import Image from "next/image"
import styled from "styled-components"

// Change colour from black to GDS text-blue (#144e81) with CSS filters
const LockedIcon = styled(Image)`
  filter: invert(12%) sepia(70%) saturate(4629%) hue-rotate(197deg) brightness(97%) contrast(84%);
`

export { LockedIcon }
