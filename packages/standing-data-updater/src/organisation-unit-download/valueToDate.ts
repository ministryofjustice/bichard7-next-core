const valueToDate = (value?: string | number | null): Date | undefined => {
  let result: Date | undefined

  if (value === undefined || value === null || (typeof value === "string" && value.trim()) === "") {
    return undefined
  }

  if (typeof value === "string") {
    result = new Date(value.trim())
  } else {
    result = new Date((value - (25567 + 2)) * 86400 * 1000)
  }

  if (result && Number.isNaN(result.getTime())) {
    console.log(`INVALID DATE FORMAT: [${value}]`)
    return undefined
  }

  return result
}

export default valueToDate
