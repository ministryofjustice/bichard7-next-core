import axios from "axios"

export default (downloadLocation: string): Promise<Buffer> =>
  axios({
    url: downloadLocation,
    method: "GET",
    responseType: "arraybuffer"
  }).then((response) => Buffer.from(response.data))
