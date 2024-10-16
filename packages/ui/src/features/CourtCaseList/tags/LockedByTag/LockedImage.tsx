import Image from "next/image"
import { LOCKED_ICON_URL } from "utils/icons"
import { LockedIcon } from "./LockedImage.styles"

interface LockedImageProps {
  unlockPath?: string
}

const LockedImage = ({ unlockPath }: LockedImageProps) => {
  let image
  if (unlockPath) {
    image = <LockedIcon src={LOCKED_ICON_URL} width={18} height={18} alt="Lock icon" />
  } else {
    image = <Image src={LOCKED_ICON_URL} width={18} height={18} alt="Lock icon" />
  }

  return image
}

export default LockedImage
