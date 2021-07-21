import PdfPrinter from "pdfmake"
import moment from "moment"

import { urlToB64 } from "./utils.js"

export const cvPDFStream = async userObj => {
  const fonts = {
    Roboto: {
      normal: "src/utils/fonts/Roboto/Roboto-Regular.ttf",
      bold: "src/utils/fonts/Roboto/Roboto-Bold.ttf",
      italics: "src/utils/fonts/Roboto/Roboto-Italic.ttf",
      bolditalics: "src/utils/fonts/Roboto/Roboto-BoldItalic.ttf",
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
      {
        columns: [
          {
            width: "70%",
            stack: [
              { text: `${userObj.name} ${userObj.surname}`, fontSize: 22, margin: [0, 0, 0, 15], alignment: "center" },
              { text: [{ text: `Email`, decoration: "underline" }, `: ${userObj.email}`], margin: [0, 0, 0, 10] },
              { text: [{ text: `Bio`, decoration: "underline" }, `: ${userObj.bio}`], margin: [0, 0, 0, 10] },
              { text: [{ text: `Title`, decoration: "underline" }, `: ${userObj.title}`], margin: [0, 0, 0, 10] },
              { text: [{ text: `Area`, decoration: "underline" }, `: ${userObj.area}`] },
            ],
          },
          {
            stack: [{ image: userAvatarB64, width: 150 }],
          },
        ],
      },
      { text: "EXPERIENCE", bold: true, fontSize: 16, margin: [0, 30] },
    ],
  }

  userObj.experiences.forEach(experience => {
    docDefinition.content.push({
      stack: [
        {
          columns: [
            {
              width: "50%",
              text: [{ text: `Company: `, bold: true }, experience.company],
            },
            {
              text: `${moment(experience.startDate).format("MMM YYYY")} - ${
                experience.endDate ? `${moment(experience.endDate).format("MMM YYYY")}` : ""
              }`,
              margin: [0, 0, 0, 5],
              alignment: "right",
            },
          ],
        },
        { text: [{ text: `Role: `, bold: true }, experience.role], margin: [0, 0, 0, 5] },
        { text: [{ text: `Area: `, bold: true }, experience.area], margin: [0, 0, 0, 5] },
        { text: "Description:", bold: true, lineHeight: 1.2 },
        { text: experience.description, margin: [0, 0, 0, 30] },
      ],
    })
  })

  // { text: postObj.title, fontSize: 28, font: "IndieFlower", alignment: "center", margin: [0, 0, 0, 10] },
  // { image: imageStr, alignment: "center", fit: [300, 300], margin: [0, 0, 0, 10] },
  // { text: `Created at: ${new Date(postObj.createdAt).toISOString().split("T")[0]}`, margin: [0, 0, 0, 20] },
  // striptags(postObj.content),

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()
  return pdfReadableStream
}
