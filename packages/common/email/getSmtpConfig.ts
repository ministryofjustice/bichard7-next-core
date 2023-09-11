const getSmptpConfig = () => ({
  host: process.env.SMTP_HOST ?? "console",
  user: process.env.SMTP_USER ?? "bichard",
  password: process.env.SMTP_PASSWORD ?? "password",
  port: parseInt(process.env.SMTP_PORT ?? "587", 10),
  tls: process.env.SMTP_TLS === "true",
  debug: process.env.SMTP_DEBUG === "true"
})

export default getSmptpConfig
