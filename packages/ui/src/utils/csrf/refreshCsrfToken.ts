import axios from "axios"

const refreshCsrfToken = async (callback: (csrfToken: string) => void) => {
  await axios.get("/bichard/api/refresh-csrf-token").then((response) => callback(response.data.csrfToken as string))
}

export default refreshCsrfToken
