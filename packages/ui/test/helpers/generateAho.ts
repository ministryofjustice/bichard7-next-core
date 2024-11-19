export type GenerateAhoParams = {
  ahoTemplate: string
  courtName: string
  firstName: string
  lastName: string
  ptiurn: string
}

const generateAho = (params: GenerateAhoParams) => {
  return params.ahoTemplate
    .replaceAll("{FIRSTNAME}", params.firstName)
    .replaceAll("{LASTNAME}", params.lastName)
    .replaceAll("{PTIURN}", params.ptiurn)
    .replaceAll("{COURTNAME}", params.courtName)
}

export default generateAho
