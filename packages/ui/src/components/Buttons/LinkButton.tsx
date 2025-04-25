import { useRouter } from "next/router"
import { SyntheticEvent, useState } from "react"

export interface LinkButtonProps extends React.ComponentProps<"a"> {
  href: string
  secondary?: boolean
  dataModule?: string
  canBeDisabled?: boolean
  disabled?: boolean
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  secondary = false,
  dataModule = "govuk-button",
  canBeDisabled = false,
  ...linkButtonProps
}: LinkButtonProps) => {
  const { asPath, basePath } = useRouter()
  const [isClicked, setIsClicked] = useState(false)

  const classNames = linkButtonProps.className?.split(" ") ?? []

  if (!classNames.includes("govuk-button")) {
    classNames.push("govuk-button")
  }

  if (secondary) {
    classNames.push("govuk-button--secondary")
  }

  const handleClick = (event: SyntheticEvent) => {
    if (event.currentTarget.getAttribute("disabled")) {
      event.preventDefault()
    }
    if (canBeDisabled) {
      setIsClicked(true)
    }
  }

  linkButtonProps.disabled = canBeDisabled && isClicked

  return (
    <a
      {...linkButtonProps}
      href={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}
      role="button"
      draggable="false"
      className={classNames.join(" ")}
      data-module={dataModule}
      onClick={(e) => {
        handleClick(e)
        if (linkButtonProps.onClick) {
          linkButtonProps.onClick(e)
        }
      }}
    >
      {children}
    </a>
  )
}
