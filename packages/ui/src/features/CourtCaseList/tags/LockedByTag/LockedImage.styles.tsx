import Image from "next/image"
import styled from "styled-components"

// Change colour from black to Bichard blue (#005BBB) with CSS filters
const LockedIcon = styled(Image)`
  filter: invert(18%) sepia(100%) saturate(3528%) hue-rotate(201deg) brightness(86%) contrast(101%);
`

export { LockedIcon }
