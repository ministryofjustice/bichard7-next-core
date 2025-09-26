/**
 * @jest-environment node
 */

import type User from "types/User"
import createPasswordChangedEmail from "useCases/createPasswordChangedEmail"

it("should generate the email content", () => {
  const user = {
    username: "Dummy username",
    emailAddress: "dummy@example.com",
    forenames: "Dummy forenames",
    surname: "Dummy surname"
  } as User

  const { subject, text, html } = createPasswordChangedEmail(user, "http://localhost:3000")

  expect(subject).toMatchSnapshot()
  expect(text).toMatchSnapshot()
  expect(html).toMatchSnapshot()
})
