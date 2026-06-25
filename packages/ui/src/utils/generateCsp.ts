const generateCsp = (nonce: string) => {
  const styleSrc = process.env.NODE_ENV === "production" ? `'self' 'nonce-${nonce}'` : "'self' 'unsafe-inline'"

  const policies = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval'`,
    `style-src ${styleSrc}`,
    "img-src 'self' data:",
    "frame-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "base-uri 'none'"
  ]

  return policies.join("; ")
}

export default generateCsp
