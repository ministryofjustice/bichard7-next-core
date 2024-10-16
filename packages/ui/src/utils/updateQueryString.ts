const updateQueryString = (params: Record<string, unknown>) => {
  const searchParams = new URLSearchParams(window.location.search)
  Object.entries(params).map(([key, value]) => {
    if (value === null) {
      searchParams.delete(key)
    } else {
      searchParams.set(key, String(value))
    }
  })
  const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString()
  history.pushState(null, "", newRelativePathQuery)
}

export default updateQueryString
