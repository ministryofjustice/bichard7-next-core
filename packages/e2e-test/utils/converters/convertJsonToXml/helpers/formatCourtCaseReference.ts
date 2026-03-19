export const formatCourtCaseReference = (courtCaseReference: string) =>
  courtCaseReference
    .split("/")
    .map((part, index) => (index === 2 ? part.replace(/^0+/, "") : part))
    .join("/")
