import Email from "./Email"

export default interface Emailer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendMail: (email: Email) => any
}
