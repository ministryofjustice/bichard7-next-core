import { useCsrfToken } from "context/CsrfTokenContext"
import { useCallback, useEffect } from "react"
import useFirstLoad from "./useFirstLoad"

interface RefreshCsrfTokenProps {
  dependency: unknown
}

const useRefreshCsrfToken = (props?: RefreshCsrfTokenProps) => {
  const { updateCsrfToken } = useCsrfToken()
  const firstLoad = useFirstLoad()

  const fetchNewCsrfToken = useCallback(() => {
    fetch("/bichard/api/refresh-csrf-token")
      .then((response) => response.json())
      .then((data) => updateCsrfToken(data.csrfToken as string))
  }, [updateCsrfToken])

  useEffect(() => {
    if (firstLoad) {
      return
    }

    fetchNewCsrfToken()
  }, [props?.dependency, fetchNewCsrfToken])

  return { fetchNewCsrfToken }
}

export default useRefreshCsrfToken
