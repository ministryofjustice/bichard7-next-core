import { format, formatDistanceStrict } from "date-fns"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { REFRESH_ICON_URL } from "utils/icons"
import { RefreshButtonContainer, StyledRefreshButton } from "./RefreshButton.styles"

interface RefreshButtonProps extends React.ComponentProps<"button"> {
  location: string
}

export const RefreshButton = ({ location, ...buttonProps }: RefreshButtonProps) => {
  const router = useRouter()
  const [dateAgo, setDateAgo] = useState(new Date())
  const [timeAgo, setTimeAgo] = useState(formatDistanceStrict(dateAgo, new Date()))
  const [nextRouterChanged, setNextRouterChanged] = useState(false)

  useEffect(() => {
    const handleRouteChange = () => setNextRouterChanged(true)

    router.events.on("routeChangeComplete", handleRouteChange)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatDistanceStrict(dateAgo, new Date()))
    }, 1000)

    return () => clearInterval(interval)
  }, [dateAgo])

  useEffect(() => {
    if (nextRouterChanged) {
      setDateAgo(new Date())
    }

    setNextRouterChanged(false)
  }, [nextRouterChanged])

  const formattedTimeAgo = ["Last updated"]
  const regex = new RegExp(/^\b\d+\b seconds?$/)

  if (regex.test(timeAgo)) {
    formattedTimeAgo.push("less than a minute ago")
  } else {
    formattedTimeAgo.push(`${timeAgo} ago`)
  }

  const handleOnClick = () => {
    router.reload()
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
