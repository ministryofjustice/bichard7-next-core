import type { User } from "../types/User"

import Permission from "../types/Permission"
import { UserGroup } from "../types/UserGroup"
import { userAccess } from "./userPermissions"

const userHasAccessTo = (...groups: UserGroup[]) => userAccess({ groups: [...groups] } as User)

describe("user permissions", () => {
  it("User in only exception handler group", () => {
    const userAccess = userHasAccessTo(UserGroup.ExceptionHandler)

    expect(userAccess[Permission.Exceptions]).toBe(true)
    expect(userAccess[Permission.Triggers]).toBe(false)
  })

  it("User in only trigger handler group", () => {
    const userAccess = userHasAccessTo(UserGroup.TriggerHandler)

    expect(userAccess[Permission.Exceptions]).toBe(false)
    expect(userAccess[Permission.Triggers]).toBe(true)
  })

  it("User in only general handler group", () => {
    const userAccess = userHasAccessTo(UserGroup.GeneralHandler)

    expect(userAccess[Permission.Exceptions]).toBe(true)
    expect(userAccess[Permission.Triggers]).toBe(true)
  })

  it("User in only allocator group", () => {
    const userAccess = userHasAccessTo(UserGroup.Allocator)

    expect(userAccess[Permission.Exceptions]).toBe(true)
    expect(userAccess[Permission.Triggers]).toBe(true)
  })

  it("User in only supervisor group", () => {
    const userAccess = userHasAccessTo(UserGroup.Supervisor)

    expect(userAccess[Permission.Exceptions]).toBe(true)
    expect(userAccess[Permission.Triggers]).toBe(true)
    expect(userAccess[Permission.ViewReports]).toBe(true)
  })

  it("User in all groups except supervisor", () => {
    const userAccess = userHasAccessTo(
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
    expect(userAccess[Permission.ViewReports]).toBe(false)
  })

  it("User in all non-handler groups", () => {
    const userAccess = userHasAccessTo(
      UserGroup.Audit,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.SuperUserManager,
      UserGroup.UserManager
    )

    expect(userAccess[Permission.Exceptions]).toBe(false)
    expect(userAccess[Permission.Triggers]).toBe(false)
  })

  it("User in user manager group", () => {
    const userAccess = userHasAccessTo(UserGroup.SuperUserManager, UserGroup.UserManager)

    expect(userAccess[Permission.ViewUserManagement]).toBe(true)
  })

  it("User in all groups except user manager groups", () => {
    const userAccess = userHasAccessTo(
      UserGroup.Allocator,
      UserGroup.Audit,
      UserGroup.ExceptionHandler,
      UserGroup.GeneralHandler,
      UserGroup.TriggerHandler,
      UserGroup.AuditLoggingManager,
      UserGroup.NewUI,
      UserGroup.Supervisor
    )
    expect(userAccess[Permission.ViewUserManagement]).toBe(false)
  })

  it("User with no groups", () => {
    const userAccess = userHasAccessTo()

    expect(userAccess[Permission.Exceptions]).toBe(false)
    expect(userAccess[Permission.Triggers]).toBe(false)
  })
})
