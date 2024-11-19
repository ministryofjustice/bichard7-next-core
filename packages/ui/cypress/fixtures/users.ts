import type User from "services/entities/User"

import { UserGroup } from "@moj-bichard7/common/types/UserGroup"
import TriggerCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/TriggerCode"

import hashedPassword from "./hashedPassword"

const numberedUsers = () => {
  const newUsers: Record<string, { groups: UserGroup[] } & Partial<User>> = {}
  for (let i = 1; i < 5; i++) {
    const user = {
      email: `bichard.force.0${i}@example.com`,
      forenames: "Bichard Test User",
      groups: [UserGroup.NewUI, UserGroup.GeneralHandler],
      password: hashedPassword,
      surname: `Force 0${i}`,
      username: `BichardForce0${i}`,
      visibleCourts: [`B0${i}C`],
      visibleForces: [`00${i}`]
    }
    newUsers[user.username] = user
  }

  return newUsers
}

const users: Record<string, { groups: UserGroup[] } & Partial<User>> = {
  "A really really really long.name": {
    email: "longname@example.com",
    forenames: "A Really Really Really Long Name",
    groups: [UserGroup.GeneralHandler, UserGroup.NewUI],
    password: hashedPassword,
    surname: "User",
    username: "A really really really long.name",
    visibleForces: ["01"]
  },
  Bichard011111: {
    email: "bichard011111@example.com",
    forenames: "Bichard Test",
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler],
    password: hashedPassword,
    surname: "User",
    username: "Bichard011111",
    visibleForces: ["0011111"]
  },
  Court02User: {
    email: "court02user@example.com",
    forenames: "Court 02",
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler],
    password: hashedPassword,
    surname: "User",
    username: "Court02User",
    visibleCourts: ["B02"],
    visibleForces: []
  },
  ExceptionHandler: {
    email: "exceptionhandler@example.com",
    forenames: "Exception Handler",
    groups: [UserGroup.NewUI, UserGroup.ExceptionHandler],
    password: hashedPassword,
    surname: "User",
    username: "ExceptionHandler",
    visibleForces: ["01"]
  },
  GeneralHandler: {
    email: "generalhandler@example.com",
    forenames: "General Handler",
    groups: [UserGroup.GeneralHandler, UserGroup.NewUI],
    password: hashedPassword,
    surname: "User",
    username: "GeneralHandler",
    visibleForces: ["01"]
  },
  MultigroupSupervisor: {
    email: "multigroupsupervisor@example.com",
    forenames: "MultigroupSupervisor",
    groups: [UserGroup.NewUI, UserGroup.Supervisor, UserGroup.ExceptionHandler],
    password: hashedPassword,
    surname: "User",
    username: "MultigroupSupervisor",
    visibleForces: ["01"]
  },
  NoExceptionsFeatureFlag: {
    email: "noexceptionsfeatureflag@example.com",
    featureFlags: { exceptionsEnabled: false },
    forenames: "No Exceptions Feature Flag",
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler],
    password: hashedPassword,
    surname: "User",
    username: "NoExceptionsFeatureFlag",
    visibleForces: ["01"]
  },
  NoGroups: {
    email: "nogroups@example.com",
    forenames: "No Groups",
    groups: [UserGroup.NewUI],
    password: hashedPassword,
    surname: "User",
    username: "NoGroups",
    visibleForces: ["01"]
  },
  OffenceMatchingDisabled: {
    email: "offencematchingdisabled@example.com",
    featureFlags: { exceptionsEnabled: true, offenceMatchingEnabled: false },
    forenames: "Offence Matching Disabled",
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler],
    password: hashedPassword,
    surname: "User",
    username: "OffenceMatchingDisabled",
    visibleForces: ["01"]
  },
  Supervisor: {
    email: "supervisor@example.com",
    forenames: "Supervisor",
    groups: [UserGroup.NewUI, UserGroup.Supervisor],
    password: hashedPassword,
    surname: "User",
    username: "Supervisor",
    visibleForces: ["01"]
  },
  SupervisorWithExcludedTriggers: {
    email: "SupervisorWithExcludedTriggers@example.com",
    excludedTriggers: [TriggerCode.TRPR0001, TriggerCode.TRPR0002, TriggerCode.TRPR0003, TriggerCode.TRPR0008],
    forenames: "Supervisor1",
    groups: [UserGroup.NewUI, UserGroup.Supervisor],
    password: hashedPassword,
    surname: "WithExcludedTriggers",
    username: "SupervisorWithExcludedTriggers",
    visibleForces: ["01"]
  },
  TriggerHandler: {
    email: "triggerhandler@example.com",
    forenames: "Trigger Handler",
    groups: [UserGroup.NewUI, UserGroup.TriggerHandler],
    password: hashedPassword,
    surname: "User",
    username: "TriggerHandler",
    visibleForces: ["01"]
  },
  UserManager: {
    email: "usermanager@example.com",
    forenames: "UserManager",
    groups: [UserGroup.NewUI, UserGroup.UserManager],
    password: hashedPassword,
    surname: "User",
    username: "UserManager",
    visibleForces: ["01"]
  },
  ...numberedUsers()
}

export default users
