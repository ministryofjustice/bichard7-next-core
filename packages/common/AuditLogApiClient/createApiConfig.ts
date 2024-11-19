const createApiConfig = () => {
  const apiUrl = process.env.AUDIT_LOG_API_URL
  const apiKey = process.env.AUDIT_LOG_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error("AUDIT_LOG_API_URL and AUDIT_LOG_API_KEY environment variables must be set")
  }

  return { apiUrl, apiKey }
}

export default createApiConfig
