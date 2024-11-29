export type JWT = {
  emailAddress: string
  exclusionList: string[]
  exp: number // Epoch
  groups: string[]
  iat: number // Epoch
  id: string
  inclusionList: string[]
  iss: string
  username: string
}
