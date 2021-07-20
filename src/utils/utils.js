import axios from "axios"
import mime from "mime"
import { extname } from "path"

export const urlToB64 = async url => {
  try {
    // data is a buffer
    const response = await axios.get(url, {
      responseType: "arraybuffer",
    })
    const data = response.data
    const mimeType = mime.lookup(extname(url))
    const b64String = `data:${mimeType};base64,${data.toString("base64")}`
    return b64String
  } catch (error) {
    console.log(error)
  }
}
