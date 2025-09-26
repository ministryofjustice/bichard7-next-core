import UserGroup from "./UserGroup"

interface UserAuthBichard {
  id: number
  username: string
  emailAddress: string
  inclusionList: string[]
  exclusionList: string[]
  emailVerificationCode: string
  emailVerificationCurrent: string
  loginTooSoon: boolean
  deletedAt: Date
  password: string
  migratedPassword: string
  groups: UserGroup[]
}

export default UserAuthBichard
