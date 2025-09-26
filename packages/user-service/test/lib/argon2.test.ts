/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { hashPassword, verifyPassword } from "lib/argon2"

it("should generate correct hash format", async () => {
  const hash = await hashPassword("Dummy password")

  expect(hash).toMatch(/\$argon2id\$v=19\$m=15360,t=2,p=1\$.+/)
})

it("should verify the password when correct password is provided", async () => {
  const plainPassword = "This is a dummy password"
  const hash = await hashPassword(plainPassword)

  expect(hash).toBeDefined()

  const result = await verifyPassword(plainPassword, hash!)

  expect(result).toBe(true)
})

it("should not verify the password when incorrect password is provided", async () => {
  const hash = await hashPassword("This is a dummy password")

  expect(hash).toBeDefined()

  const result = await verifyPassword("Incorrect password", hash!)

  expect(result).toBe(false)
})

it("should return null when argon2 memory cost parameter is set incorrectly", async () => {
  const hash = await hashPassword("This is a dummy password 1", { memoryCost: 0 })

  expect(hash).toBeNull()
})

it("should return null when argon2 parallelism parameter is set incorrectly", async () => {
  const hash = await hashPassword("This is a dummy password 2", { parallelism: 0 })

  expect(hash).toBeNull()
})

it("should return null when argon2 time cost parameter is set incorrectly", async () => {
  const hash = await hashPassword("This is a dummy password 3", { timeCost: 0 })

  expect(hash).toBeNull()
})

it("should return null when argon2 hash length parameter is set incorrectly", async () => {
  const hash = await hashPassword("This is a dummy password 4", { hashLength: 0 })

  expect(hash).toBeNull()
})

it("should return null when argon2 salt length parameter is set incorrectly", async () => {
  const hash = await hashPassword("This is a dummy password 5", { salt: Buffer.alloc(0) })

  expect(hash).toBeNull()
})
