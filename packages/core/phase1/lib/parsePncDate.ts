const parsePncDate = (pncDate: string): Date => {
  if (!pncDate || pncDate === "") {
    throw new Error("Unable to parse PNC Date")
  }

  if (/\d{4}-\d{2}-\d{2}/.test(pncDate)) {
    return new Date(pncDate)
  }

  const parsedDate = pncDate.match(/(\d{2})(\d{2})(\d{4})/)
  if (!parsedDate) {
    throw new Error("Unable to parse PNC Date")
  }

  const day = parseInt(parsedDate[1], 10)
  const month = parseInt(parsedDate[2], 10)
  const year = parseInt(parsedDate[3], 10)
  return new Date(Date.UTC(year, month - 1, day))
}

export default parsePncDate
