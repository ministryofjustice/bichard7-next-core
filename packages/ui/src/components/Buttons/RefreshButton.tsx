import { format, formatDistanceStrict } from "date-fns"
import Image from "next/image"
import { useEffect, useState } from "react"
import { REFRESH_ICON_URL } from "utils/icons"
import { RefreshButtonContainer, StyledRefreshButton } from "./RefreshButton.styles"

interface RefreshButtonProps extends React.ComponentProps<"button"> {
  location: string
}

export const RefreshButton = ({ location, ...buttonProps }: RefreshButtonProps) => {
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
    <RefreshButtonContainer className={`${location}-refresh-container`}>
      <StyledRefreshButton {...buttonProps} aria-label="refresh" onClick={handleOnClick}>
        <Image src={REFRESH_ICON_URL} width={24} height={24} alt="Refresh icon" />
        {" Refresh"}
      </StyledRefreshButton>
      <span className="govuk-body-s" title={`Last updated at ${format(dateAgo, "HH:mm:ss dd/MM/yyyy")}`}>
        {formattedTimeAgo.join(" ")}
      </span>
    </RefreshButtonContainer>
  )
}
