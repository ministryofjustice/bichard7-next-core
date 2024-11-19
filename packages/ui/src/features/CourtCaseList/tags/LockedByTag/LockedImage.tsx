import Image from "next/image"
import { LOCKED_ICON_URL } from "utils/icons"

import { LockedIcon } from "./LockedImage.styles"

interface LockedImageProps {
  unlockPath?: string
}

const LockedImage = ({ unlockPath }: LockedImageProps) => {
  let image
  if (unlockPath) {
    image = <LockedIcon alt="Lock icon" height={18} src={LOCKED_ICON_URL} width={18} />
  } else {
    image = <Image alt="Lock icon" height={18} src={LOCKED_ICON_URL} width={18} />
  }

  return image
}

export default LockedImage
