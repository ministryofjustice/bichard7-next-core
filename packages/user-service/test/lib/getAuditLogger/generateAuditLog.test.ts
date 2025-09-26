import generateAuditLog from "lib/getAuditLogger/generateAuditLog"
import { GetServerSidePropsContext } from "next"
import AuditLogEvent from "types/AuditLogEvent"
import User from "types/User"

const dummyRequest = { socket: { remoteAddress: "dummyRemoteAddress" }, url: "/dummyUrl" }

it("should generate audit log when current user exists", () => {
  const user = {
    username: "dummy",
    emailAddress: "dummy@dummy.com"
  } as User

  const testContext = { currentUser: user, req: dummyRequest } as unknown as GetServerSidePropsContext
  const auditLog = generateAuditLog(testContext, AuditLogEvent.loggedIn.code, AuditLogEvent.loggedIn.description, {
    attribute1: "test",
    attribute2: true
  })

  expect(auditLog.auditLogId).toBeDefined()
  expect(auditLog.timestamp).toBeDefined()
  expect(auditLog.description).toBe("User logged in")
  expect(auditLog.eventCode).toBe("user.logged-in")
  expect(auditLog.requestUri).toBe(dummyRequest.url)
  expect(auditLog.userIp).toBe(dummyRequest.socket.remoteAddress)
  expect(auditLog.username).toBe(user.username)
  expect(auditLog.attributes).toBeDefined()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { attribute1, attribute2 } = auditLog.attributes!
  expect(attribute1).toBe("test")
  expect(attribute2).toBe(true)
})

it("should generate audit log and get username from user object in attributes", () => {
  const user = {
    username: "dummy 2",
    emailAddress: "dummy@dummy.com"
  } as User
  const testContext = { req: dummyRequest } as unknown as GetServerSidePropsContext
  const auditLog = generateAuditLog(testContext, AuditLogEvent.loggedIn.code, AuditLogEvent.loggedIn.description, {
    attribute1: "test",
    attribute2: true,
    user
  })

  expect(auditLog.auditLogId).toBeDefined()
  expect(auditLog.timestamp).toBeDefined()
  expect(auditLog.description).toBe("User logged in")
  expect(auditLog.eventCode).toBe("user.logged-in")
  expect(auditLog.requestUri).toBe(dummyRequest.url)
  expect(auditLog.userIp).toBe(dummyRequest.socket.remoteAddress)
  expect(auditLog.username).toBe("dummy 2")
  expect(auditLog.attributes).toBeDefined()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { attribute1, attribute2 } = auditLog.attributes!
  expect(attribute1).toBe("test")
  expect(attribute2).toBe(true)
})

it("should generate audit log when current user and user object in attributes do not exist", () => {
  const testContext = { req: dummyRequest } as unknown as GetServerSidePropsContext
  const auditLog = generateAuditLog(testContext, AuditLogEvent.loggedIn.code, AuditLogEvent.loggedIn.description, {
    attribute1: "test",
    attribute2: true
  })

  expect(auditLog.auditLogId).toBeDefined()
  expect(auditLog.timestamp).toBeDefined()
  expect(auditLog.description).toBe("User logged in")
  expect(auditLog.eventCode).toBe("user.logged-in")
  expect(auditLog.requestUri).toBe(dummyRequest.url)
  expect(auditLog.userIp).toBe(dummyRequest.socket.remoteAddress)
  expect(auditLog.username).toBe("Anonymous")
  expect(auditLog.attributes).toBeDefined()

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { attribute1, attribute2 } = auditLog.attributes!
  expect(attribute1).toBe("test")
  expect(attribute2).toBe(true)
})

it("should remove unsafe attributes", () => {
  const testContext = { req: dummyRequest } as unknown as GetServerSidePropsContext
  const auditLog = generateAuditLog(testContext, AuditLogEvent.loggedIn.code, AuditLogEvent.loggedIn.description, {
    user: { name: "test User", password: "secret", migratedPassword: "secret" }
  })

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { user } = auditLog.attributes! as { user: { name: string; password?: string; migratedPassword?: string } }

  expect(user.name).toBeDefined()
  expect(user.password).toBeUndefined()
  expect(user.migratedPassword).toBeUndefined()
})
