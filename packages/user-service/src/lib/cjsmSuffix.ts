interface CjsmDomainException {
  domain: string
  cjsmDomain: string
}

const cjsmDomainExceptions: CjsmDomainException[] = [
  { domain: "madetech.com", cjsmDomain: "madetech.cjsm.net" },
  { domain: "soprasteria.com", cjsmDomain: "soprasteria.cjsm.net" }
]

const addCjsmSuffix = (emailAddress: string): string => {
  const lowerEmail = emailAddress.toLowerCase()
  if (lowerEmail.endsWith(".cjsm.net")) {
    return lowerEmail
  }

  for (const exception of cjsmDomainExceptions) {
    const { domain, cjsmDomain } = exception
    if (lowerEmail.endsWith(domain)) {
      return lowerEmail.replace(domain, cjsmDomain)
    }
  }

  return `${lowerEmail}.cjsm.net`
}

const removeCjsmSuffix = (emailAddress: string): string => {
  const lowerEmail = emailAddress.toLowerCase()

  for (const exception of cjsmDomainExceptions) {
    const { domain, cjsmDomain } = exception
    if (lowerEmail.endsWith(cjsmDomain)) {
      return lowerEmail.replace(cjsmDomain, domain)
    }
  }

  return lowerEmail.replace(".cjsm.net", "")
}

export { addCjsmSuffix, removeCjsmSuffix }
