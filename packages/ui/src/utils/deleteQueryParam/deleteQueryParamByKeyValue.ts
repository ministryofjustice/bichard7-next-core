const deleteQueryParamByKeyValue = (
  paramToRemove: { [key: string]: string },
  query: { [key: string]: string | string[] | undefined }
): URLSearchParams => {
  const searchParams = new URLSearchParams()
  const keyToRemove = Object.keys(paramToRemove)[0]
  const valueToRemove = Object.values(paramToRemove)[0]

  Object.keys(query).forEach(function (key) {
    if (typeof query[key] === "string" && (key !== keyToRemove || query[key] !== valueToRemove)) {
      searchParams.append(key, String(query[key]))
    } else if (Array.isArray(query[key])) {
      ;(query[key] as string[]).forEach((e) => {
        if (key !== keyToRemove || e !== valueToRemove) {
          searchParams.append(key, String(e))
        }
      })
    }
  })

  return searchParams
}

export default deleteQueryParamByKeyValue
