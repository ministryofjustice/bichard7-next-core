export const convertIds = (idsValue: string) => {
  const slice = (start: number, end: number) => idsValue.substring(start, end).trim()

  return {
    updateTypeKey: slice(0, 1),
    pncIdentifier: slice(1, 12),
    pncCheckName: slice(12, 24),
    croNumber: slice(24, 36)
  }
}
