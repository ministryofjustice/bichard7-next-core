import axios from "axios"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCallback, useEffect } from "react"
import useFirstLoad from "./useFirstLoad"

interface RefreshCsrfTokenProps {
  dependency: unknown
}

const useRefreshCsrfToken = (props: RefreshCsrfTokenProps | undefined = undefined) => {
  const { updateCsrfToken } = useCsrfToken()
  const firstLoad = useFirstLoad()

  const fetchNewCsrfToken = useCallback(
    () => {
      axios
        .get("/bichard/api/refresh-csrf-token")
        .then((response) => updateCsrfToken(response.data.csrfToken as string))
    },
    props?.dependency ? [props.dependency] : []
  )

  useEffect(() => {
    if (firstLoad) {
      return
    }

    fetchNewCsrfToken()
  }, [fetchNewCsrfToken])

  return { fetchNewCsrfToken }
}

export default useRefreshCsrfToken
