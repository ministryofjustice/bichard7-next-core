const addQueryParams = (url: string, params?: { [key: string]: string | number | boolean | undefined }): string => {
  if (!params) {
    return url
  }

  const u = new URL(url)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      u.searchParams.append(key, value.toString())
    }
  })
  return u.href
}

export default addQueryParams
