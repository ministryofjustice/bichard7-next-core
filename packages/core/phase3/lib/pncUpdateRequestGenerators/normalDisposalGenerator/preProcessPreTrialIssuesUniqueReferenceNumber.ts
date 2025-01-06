const preProcessPreTrialIssuesUniqueReferenceNumber = (ptiUrn?: string, forceOwner?: string) => {
  const forceCode = (forceOwner?.length === 6 ? forceOwner : ptiUrn)?.substring(0, 4) ?? ""
  return [forceCode.padStart(4, " "), "/", ptiUrn?.substring(4, 18)].join("")
}

export default preProcessPreTrialIssuesUniqueReferenceNumber
