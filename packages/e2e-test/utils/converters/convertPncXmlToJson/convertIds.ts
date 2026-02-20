export type Ids = {
  pncIdentifier: string
  pncCheckName: string
  croNumber: string
}

const convertIds = (idsValue: string): Ids => {
  const slice = (start: number, end: number) => idsValue.substring(start, end).trim()

  return {
    pncIdentifier: slice(1, 12),
    pncCheckName: slice(12, 24),
    croNumber: slice(24, 36)
  }
}

export default convertIds
