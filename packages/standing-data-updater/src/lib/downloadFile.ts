import axios from "axios"

export const downloadFile = (downloadLocation: string): Promise<Buffer> =>
  axios({
    url: downloadLocation,
    method: "GET",
    responseType: "arraybuffer"
  }).then((response) => Buffer.from(response.data))
