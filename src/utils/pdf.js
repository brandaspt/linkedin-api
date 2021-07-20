import PdfPrinter from "pdfmake"
import { urlToB64 } from "./utils.js"

export const cvPDFStream = async userObj => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-Oblique",
    },
  }

  const printer = new PdfPrinter(fonts)
  let userAvatarB64
  try {
    userAvatarB64 = await urlToB64(userObj.image)
  } catch (error) {
    console.log(error)
  }

  const docDefinition = {
    content: [
      { text: `${userObj.name} ${userObj.surname}`, fontSize: 22 },
      {
        columns: [
          {
            width: "50%",
            ul: [userObj.email, userObj.bio, userObj.title, userObj.area],
          },
          {
            width: 100,
            image: userAvatarB64,
          },
        ],
      },
    ],
  }

  // { text: postObj.title, fontSize: 28, font: "IndieFlower", alignment: "center", margin: [0, 0, 0, 10] },
  // { image: imageStr, alignment: "center", fit: [300, 300], margin: [0, 0, 0, 10] },
  // { text: `Created at: ${new Date(postObj.createdAt).toISOString().split("T")[0]}`, margin: [0, 0, 0, 20] },
  // striptags(postObj.content),

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()
  return pdfReadableStream
}
