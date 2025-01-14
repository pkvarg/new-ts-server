import { Order } from './types'
import fs from 'fs'

//const userMail = async (order: Order, origin: string) => {
const userMail = async (order: Order, origin: string, pdfBase64: string) => {
  const sk = `<div>
    <p>Dobrý deň ${order.shippingInfo.name} </p>
    <p>Váš email: ${order.userEmail}</p>
       <p>Váš telefón: ${order.shippingInfo.phone} </p>
    <p>Vaša správa: </p>
    <p>Ďakujeme Vám za správu.</p
    <p>Ozveme sa čoskoro.</p>
    <p>${origin.toLowerCase()}</p>
    </div>`

  const bcc = [process.env[`${origin}_MAILER_USERNAME`]]

  // let bcc = []

  // if (origin === 'ESHOP.PICTUSWEB.SK') {
  //   bcc = [process.env[`${origin}_MAILER_USERNAME`], process.env[`${origin}_MAILER_BCC`]]
  // } else {
  //   bcc = [process.env[`${origin}_MAILER_USERNAME`]]
  // }

  //Invoice(order)
  //await generatePDF(order.orderNumber)
  const pdfBuffer = Buffer.from(pdfBase64, 'base64')
  const date = new Date()
  const orderDate = date.toISOString()

  const filePath = `./utils/next_eshop/${order.orderNumber}_${orderDate}.pdf`

  // Write the buffer to a file
  fs.writeFileSync(filePath, new Uint8Array(pdfBuffer))

  console.log(`PDF saved to ${filePath}`)

  const data = {
    from: process.env[`${origin}_MAILER_USERNAME`],
    to: `${order.userEmail}`,
    bcc: bcc,
    subject: `${origin.toLowerCase()}`,
    //html: locale === 'sk' ? sk : locale === 'en' ? en : cz,
    html: sk,
    attachments: [
      {
        filename: `${order.orderNumber}_${orderDate}.pdf`, // Name of the attached file
        content: pdfBuffer, // The PDF buffer
      },
    ],
  }

  console.log('Mailer', bcc, data)

  return data
}

export { userMail }
