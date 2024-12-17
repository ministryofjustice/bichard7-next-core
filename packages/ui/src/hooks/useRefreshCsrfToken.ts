import axios from "axios"
import { useCsrfToken } from "context/CsrfTokenContext"
import { useCallback, useEffect } from "react"
import useFirstLoad from "./useFirstLoad"

interface RefreshCsrfTokenProps {
  dependency: unknown
}

const useRefreshCsrfToken = ({ dependency }: RefreshCsrfTokenProps) => {
  const { updateCsrfToken } = useCsrfToken()
  const firstLoad = useFirstLoad()

  const fetchNewCsrfTokenCallback = useCallback(() => {
    axios.get("/bichard/api/refresh-csrf-token").then((response) => updateCsrfToken(response.data.csrfToken as string))
  }, [dependency])

  useEffect(() => {
    if (firstLoad) {
      return
    }

    fetchNewCsrfTokenCallback()
  }, [fetchNewCsrfTokenCallback])
}

export default useRefreshCsrfToken
