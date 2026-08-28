import { NiamLedsAuthentication } from "../../../packages/core/lib/policeGateway/leds/NiamLedsAuthentication"

const generateNiamAuthToken = async () => {
  const niamAuthentication = NiamLedsAuthentication.createInstance()
  const token = await niamAuthentication.generateBearerToken()

  return token
}

export default generateNiamAuthToken
