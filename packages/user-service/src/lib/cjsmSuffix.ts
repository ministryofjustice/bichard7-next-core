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

  for (let i = 0; i < cjsmDomainExceptions.length; i++) {
    const { domain, cjsmDomain } = cjsmDomainExceptions[i]
    if (lowerEmail.endsWith(domain)) {
      return lowerEmail.replace(domain, cjsmDomain)
    }
  }

  return `${lowerEmail}.cjsm.net`
}

const removeCjsmSuffix = (emailAddress: string): string => {
  const lowerEmail = emailAddress.toLowerCase()
  for (let i = 0; i < cjsmDomainExceptions.length; i++) {
    const { domain, cjsmDomain } = cjsmDomainExceptions[i]
    if (lowerEmail.endsWith(cjsmDomain)) {
      return lowerEmail.replace(cjsmDomain, domain)
    }
  }
  return lowerEmail.replace(".cjsm.net", "")
}

export { addCjsmSuffix, removeCjsmSuffix }
