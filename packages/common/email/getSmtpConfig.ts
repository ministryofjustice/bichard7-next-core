const getSmptpConfig = () => ({
  debug: process.env.SMTP_DEBUG === "true",
  host: process.env.SMTP_HOST ?? "console",
  password: process.env.SMTP_PASSWORD ?? "password",
  port: parseInt(process.env.SMTP_PORT ?? "587", 10),
  tls: process.env.SMTP_TLS === "true",
  user: process.env.SMTP_USER ?? "bichard"
})

export default getSmptpConfig
