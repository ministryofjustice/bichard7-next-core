module.exports = {
  timeout: +(process.env.WAIT_TIME || "500000"),
  validateStatus: (status) => status === +process.env.STATUS_CODE
}
