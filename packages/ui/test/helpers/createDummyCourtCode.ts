import { faker } from "@faker-js/faker"

export default (forceCode: string): string =>
  `B${forceCode}${faker.string.alpha(2).toUpperCase()}${faker.string.numeric(2)}`
