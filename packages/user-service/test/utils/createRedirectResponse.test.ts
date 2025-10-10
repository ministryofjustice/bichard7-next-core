import createRedirectResponse from "utils/createRedirectResponse"

it("should return redirect response when url is passed", () => {
  const result = createRedirectResponse("DummyURL")

  expect(result).toBeDefined()
  expect(Object.keys(result)).toHaveLength(1)
  expect(result).toHaveProperty("redirect")

  const { redirect } = result as { redirect: { destination: string; statusCode: number } }
  expect(redirect.destination).toBe("DummyURL")
  expect(redirect.statusCode).toBe(302)
})
