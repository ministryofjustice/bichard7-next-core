import jwt from "jsonwebtoken"
import tokenSecret from "./tokenSecret"

export const invalidToken = () => jwt.sign({ foo: "bar" }, tokenSecret, { issuer: "Bichard" })

export const validToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

export const generateNewPasswordToken = (emailAddress, verificationCode) =>
  jwt.sign({ emailAddress, verificationCode }, tokenSecret, { issuer: "Bichard" })

export const decodeAuthenticationToken = (token) => jwt.verify(token, tokenSecret, { issuer: "Bichard" })
