export type JWT = {
  username: string
  exclusionList: string[]
  inclusionList: string[]
  emailAddress: string
  groups: string[]
  id: string
  iat: number // Epoch
  exp: number // Epoch
  iss: string
}
