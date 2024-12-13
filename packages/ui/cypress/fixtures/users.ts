import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import type User from "services/entities/User"
import hashedPassword from "./hashedPassword"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

const numberedUsers = () => {
  const newUsers: Record<string, Partial<User> & { groups: UserGroup[] }> = {}
  for (let i = 1; i < 5; i++) {
    const user = {
      username: `BichardForce0${i}`,
      visibleForces: [`00${i}`],
      visibleCourts: [`B0${i}C`],
      forenames: "Bichard Test User",
      surname: `Force 0${i}`,
      email: `bichard.force.0${i}@example.com`,
      password: hashedPassword,
      groups: [UserGroup.NewUI, UserGroup.GeneralHandler]
    }
    newUsers[user.username] = user
  }

  return newUsers
}

const users: Record<string, Partial<User> & { groups: UserGroup[] }> = {
  GeneralHandler: {
    username: "GeneralHandler",
    visibleForces: ["001"],
    forenames: "General Handler",
    surname: "User",
    email: "generalhandler@example.com",
    password: hashedPassword,
    groups: [UserGroup.GeneralHandler, UserGroup.NewUI]
  },
  "A really really really long.name": {
    username: "A really really really long.name",
    visibleForces: ["01"],
    forenames: "A Really Really Really Long Name",
    surname: "User",
    email: "longname@example.com",
    password: hashedPassword,
    groups: [UserGroup.GeneralHandler, UserGroup.NewUI]
  },
  Bichard011111: {
    username: "Bichard011111",
    visibleForces: ["0011111"],
    forenames: "Bichard Test",
    surname: "User",
    email: "bichard011111@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler]
  },
  TriggerHandler: {
    username: "TriggerHandler",
    visibleForces: ["01"],
    forenames: "Trigger Handler",
    surname: "User",
    email: "triggerhandler@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.TriggerHandler]
  },
  ExceptionHandler: {
    username: "ExceptionHandler",
    visibleForces: ["01"],
    forenames: "Exception Handler",
    surname: "User",
    email: "exceptionhandler@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.ExceptionHandler]
  },
  Supervisor: {
    username: "Supervisor",
    visibleForces: ["01"],
    forenames: "Supervisor",
    surname: "User",
    email: "supervisor@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.Supervisor]
  },
  UserManager: {
    username: "UserManager",
    visibleForces: ["01"],
    forenames: "UserManager",
    surname: "User",
    email: "usermanager@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.UserManager]
  },
  MultigroupSupervisor: {
    username: "MultigroupSupervisor",
    visibleForces: ["01"],
    forenames: "MultigroupSupervisor",
    surname: "User",
    email: "multigroupsupervisor@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.Supervisor, UserGroup.ExceptionHandler]
  },
  NoGroups: {
    username: "NoGroups",
    visibleForces: ["01"],
    forenames: "No Groups",
    surname: "User",
    email: "nogroups@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI]
  },
  OffenceMatchingDisabled: {
    username: "OffenceMatchingDisabled",
    visibleForces: ["01"],
    forenames: "Offence Matching Disabled",
    surname: "User",
    email: "offencematchingdisabled@example.com",
    password: hashedPassword,
    featureFlags: { offenceMatchingEnabled: false },
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler]
  },
  Court02User: {
    username: "Court02User",
    visibleForces: [],
    visibleCourts: ["B02"],
    forenames: "Court 02",
    surname: "User",
    email: "court02user@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler]
  },
  userExcludedTriggers: {
    username: "userExcludedTriggers",
    visibleForces: ["007"],
    forenames: "Supervisor1",
    surname: "User",
    email: "userExcludedTriggers@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.Supervisor],
    excludedTriggers: [TriggerCode.TRPR0001, TriggerCode.TRPR0002, TriggerCode.TRPR0003, TriggerCode.TRPR0008]
  },
  userExcludedTriggersMultiForces: {
    username: "userExcludedTriggersMultiForces",
    visibleForces: ["001", "002", "003"],
    forenames: "Supervisor2",
    surname: "User",
    email: "userExclTriggsMultiForces@example.com",
    password: hashedPassword,
    groups: [UserGroup.NewUI, UserGroup.Supervisor],
    excludedTriggers: [TriggerCode.TRPR0012, TriggerCode.TRPS0008, TriggerCode.TRPR0021, TriggerCode.TRPR0030]
  },
  userWithoutExcludedTriggers: {
    username: "Bichard18",
    visibleForces: ["18"],
    forenames: "Bichard18",
    surname: "User",
    email: "bichard18@example.com",
    password: hashedPassword,
    groups: [UserGroup.GeneralHandler, UserGroup.NewUI]
  },
  ...numberedUsers()
}

export default users
