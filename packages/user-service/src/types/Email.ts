import type EmailContent from "./EmailContent"

export default interface Email extends EmailContent {
  from: string
  to: string
}
