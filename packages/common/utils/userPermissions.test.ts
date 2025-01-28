import type { User, UserDto } from "../types/User"

import Permission from "../types/Permission"
import { UserGroup } from "../types/UserGroup"
import { userAccess } from "./userPermissions"

const createUser = (...groups: UserGroup[]) => {
  const userDto = {
    email: "user@example.com",
    featureFlags: {},
    forenames: null,
    groups: [...groups],
    hasAccessTo: userAccess({ groups: [...groups] } as User),
    surname: null,
    username: "user",
    visibleForces: null
  } as UserDto

  return userDto
}

describe("user permissions", () => {
  it("User in only exception handler group", () => {
    const user = createUser(UserGroup.ExceptionHandler)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(false)
  })

  it("User in only trigger handler group", () => {
    const user = createUser(UserGroup.TriggerHandler)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
  })

  it("User in only general handler group", () => {
    const user = createUser(UserGroup.GeneralHandler)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
  })

  it("User in only allocator group", () => {
    const user = createUser(UserGroup.Allocator)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
  })

  it("User in only supervisor group", () => {
    const user = createUser(UserGroup.Supervisor)

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(true)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(true)
    expect(user.hasAccessTo[Permission.ViewReports]).toBe(true)
  })

  it("User in all groups except supervisor", () => {
    const user = createUser(
      UserGroup.Allocator,
      UserGroup.Audit,
      UserGroup.ExceptionHandler,
      UserGroup.GeneralHandler,
      UserGroup.TriggerHandler,
      UserGroup.UserManager,
      UserGroup.AuditLoggingManager,
      UserGroup.SuperUserManager,
      UserGroup.NewUI
    )
    expect(user.hasAccessTo[Permission.ViewReports]).toBe(false)
  })

  it("User in all non-handler groups", () => {
    const user = createUser(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(false)
  })

  it("User in user manager group", () => {
    const user = createUser(UserGroup.SuperUserManager, UserGroup.UserManager)

    expect(user.hasAccessTo[Permission.ViewUserManagement]).toBe(true)
  })

  it("User in all groups except user manager groups", () => {
    const user = createUser(
      UserGroup.Allocator,
      UserGroup.Audit,
      UserGroup.ExceptionHandler,
      UserGroup.GeneralHandler,
      UserGroup.TriggerHandler,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.Supervisor
    )
    expect(user.hasAccessTo[Permission.ViewUserManagement]).toBe(false)
  })

  it("User with no groups", () => {
    const user = createUser()

    expect(user.hasAccessTo[Permission.Exceptions]).toBe(false)
    expect(user.hasAccessTo[Permission.Triggers]).toBe(false)
  })
})
