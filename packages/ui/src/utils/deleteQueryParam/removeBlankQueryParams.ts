const removeBlankQueryParams = (queryParams: URLSearchParams): URLSearchParams => {
  const newQueryParams: URLSearchParams = new URLSearchParams()

  queryParams.forEach((value: string, key: string) => {
    if (value !== "") {
      newQueryParams.set(key, value)
    } else {
      newQueryParams.delete(key)
    }
  })

  return newQueryParams
}

export default removeBlankQueryParams
