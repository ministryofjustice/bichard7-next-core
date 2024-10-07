import User from "services/entities/User"
import { UserGroup } from "../../src/types/UserGroup"
import hashedPassword from "./hashedPassword"

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
    visibleForces: ["01"],
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
  NoExceptionsFeatureFlag: {
    username: "NoExceptionsFeatureFlag",
    visibleForces: ["01"],
    forenames: "No Exceptions Feature Flag",
    surname: "User",
    email: "noexceptionsfeatureflag@example.com",
    password: hashedPassword,
    featureFlags: { exceptionsEnabled: false },
    groups: [UserGroup.NewUI, UserGroup.GeneralHandler]
  },
  OffenceMatchingDisabled: {
    username: "OffenceMatchingDisabled",
    visibleForces: ["01"],
    forenames: "Offence Matching Disabled",
    surname: "User",
    email: "offencematchingdisabled@example.com",
    password: hashedPassword,
    featureFlags: { exceptionsEnabled: true, offenceMatchingEnabled: false },
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
  ...numberedUsers()
}

export default users
