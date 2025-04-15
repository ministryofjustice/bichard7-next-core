const groupErrorsFromReport = (errorReport: string): Record<string, number> => {
  const errorsCodes: Record<string, number> = {}
  errorReport.match(/(HO)[0-9]{1,9}/g)?.forEach((code) => {
    errorsCodes[code] = errorsCodes[code] ? errorsCodes[code] + 1 : (errorsCodes[code] = 1)
  })
  return errorsCodes
}

export default groupErrorsFromReport
