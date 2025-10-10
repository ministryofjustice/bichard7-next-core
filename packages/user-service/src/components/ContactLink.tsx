import { ReactNode } from "react"
import Link from "./Link"

interface Props {
  children: ReactNode
}

const ContactLink = ({ children }: Props) => <Link href={"/faq"}>{children}</Link>

export default ContactLink
