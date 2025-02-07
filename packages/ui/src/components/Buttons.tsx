import { format, formatDistanceStrict } from "date-fns"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { REFRESH_ICON_URL } from "utils/icons"
import { RefreshButtonContainer, StyledRefreshButton } from "./Buttons.styles"

interface ButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode
  dataModule?: string
}

interface LinkButtonProps extends ButtonProps {
  href: string
  secondary?: boolean
}

const Button = ({ children, dataModule = "govuk-button", ...buttonProps }: ButtonProps) => {
  const classNames = buttonProps.className?.split(" ") ?? []

  if (!classNames.includes("govuk-button")) {
    classNames.push("govuk-button")
  }

  return (
    <button {...buttonProps} className={classNames.join(" ")} data-module={dataModule}>
      {children}
    </button>
  )
}

const SecondaryButton = ({ children, ...buttonProps }: ButtonProps) => (
  <Button {...buttonProps} className={`govuk-button--secondary ${buttonProps.className}`}>
    {children}
  </Button>
)

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  secondary = false,
  ...buttonProps
}: LinkButtonProps) => {
  const { asPath, basePath } = useRouter()

  return (
    <a href={href.startsWith("/") ? href : `${basePath}${asPath}/${href}`}>
      {secondary ? (
        <SecondaryButton {...buttonProps}>{children}</SecondaryButton>
      ) : (
        <Button {...buttonProps}>{children}</Button>
      )}
    </a>
  )
}

const RefreshButton = ({ ...buttonProps }) => {
  const [dateAgo] = useState(new Date())
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceStrict(dateAgo, new Date()))
    }, 1000)

    return () => clearInterval(interval)
  }, [dateAgo, timeAgo])

  const rawTimeAgo = formatDistanceStrict(dateAgo, new Date())
  const formattedTimeAgo = ["Last updated"]
  const regex = new RegExp(/^\b\d+\b seconds?$/)

  if (regex.test(rawTimeAgo)) {
    formattedTimeAgo.push("less than a minute ago")
  } else {
    formattedTimeAgo.push(`${rawTimeAgo} ago`)
  }

  const handleOnClick = () => {
    window.location.reload()
  }

  return (
    <RefreshButtonContainer>
      <StyledRefreshButton {...buttonProps} aria-label="refresh" onClick={handleOnClick}>
        <Image src={REFRESH_ICON_URL} width={24} height={24} alt="Refresh icon" />
        {" Refresh"}
      </StyledRefreshButton>
      <span className="govuk-body-s" title={`Last updated at ${format(dateAgo, "dd/MM/yyyy HH:mm:ss")}`}>
        {formattedTimeAgo.join(" ")}
      </span>
    </RefreshButtonContainer>
  )
}
export { Button, LinkButton, RefreshButton, SecondaryButton }
