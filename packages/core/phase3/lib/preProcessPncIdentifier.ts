const preProcessPncIdentifier = (pncIdentifier?: string) => {
  if (!pncIdentifier) {
    return null
  }

  const { identifier, year } = pncIdentifier.match(/\d{2}(?<year>\d{2})\/0*(?<identifier>.+)/)?.groups ?? {}

  return `${year}/${identifier}`
}

export default preProcessPncIdentifier