import { stringify } from "qs"

export default (href: string, params: { [key: string]: string | number }) => `${href}?${stringify(params)}`
