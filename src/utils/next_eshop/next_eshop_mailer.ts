import { Order } from './types'
import fs from 'fs'
import mjml2html from 'mjml'

//const userMail = async (order: Order, origin: string) => {
const userMail = async (order: Order, origin: string, pdfBase64: string) => {
  // const sk = `<div>
  //   <p>Dobrý deň ${order.shippingInfo.name} </p>
  //   <p>Váš email: ${order.userEmail}</p>
  //      <p>Váš telefón: ${order.shippingInfo.phone} </p>
  //   <p>Vaša správa: </p>
  //   <p>Ďakujeme Vám za správu.</p
  //   <p>Ozveme sa čoskoro.</p>
  //   <p>${origin.toLowerCase()}</p>
  //   </div>`

  const orderEmail = `<div style="font-size: 17.5px;">
  <p style="font-size: 20px;">Vaša objednávka</p>  
  <p>Dobrý deň,</p>
  <p>${order.shippingInfo.name}</p>
     <p>${order.shippingInfo.street} ${order.shippingInfo.house_number}, ${
    order.shippingInfo.city
  }, ${order.shippingInfo.zip}</p>
   <p>Telefón: ${order.shippingInfo.phone} </p>
    <p>Email: ${order.userEmail} </p>
     <p>Produkty spolu: ${order.productTotalsPrice.toFixed(2)}&#8364;</p>
    <ul>
      ${order.products
        .map(
          (product: { name: string; qty: number; priceInCents: number }) => `<li>
          ${product.qty} x ${product.name}, ${(product.priceInCents / 100).toFixed(
            2,
          )}&#8364; /ks</li>`,
        )
        .join('')}
    </ul>
    
    
   
    
    <p>Spôsob platby: ${
      order.shippingInfo.payment_type === 'bank transfer'
        ? 'Bankovým prevodom vopred'
        : order.shippingInfo.payment_type === 'cash'
        ? 'Hotovosť pri prevzatí'
        : 'Platobnou kartou online'
    }</p>
    <p>Status: ${order.paidAt ? 'Zaplatené' : 'Nezaplatené'}</p>
    <p>Poštovné: ${order.postage.toFixed(2)}&#8364;</p>
    <p>Daň 23%: ${order.tax.toFixed(2)}&#8364;</p>
    <p>Celkom: ${order.pricePaidInCents / 100}&#8364;</p>
${
  order.shippingInfo.payment_type === 'bank transfer' &&
  `<p>Variabilný symbol: ${order.orderNumber} </p>
   <p>IBAN: SKXXX01234567890</p>
  `
}
   <p>Poznámka: ${order.shippingInfo.note} </p>
    
    <p>Ďakujeme za Váš nákup!</p
   
    <p>${origin.toLowerCase()}</p>
    </div>`

  //   const mjmlTemplate = `
  // <mjml>
  //   <mj-body>
  //     <mj-section>
  //       <mj-column>
  //         <mj-text font-family="Arial" font-size="16px" text-align="left">
  //           Dobrý deň ${order.shippingInfo.name},
  //         </mj-text>
  //         <mj-text text-align="left">
  //           Váš email: ${order.userEmail}
  //         </mj-text>
  //         <mj-text text-align="left">
  //           Váš telefón: ${order.shippingInfo.phone}
  //         </mj-text>
  //         <mj-text text-align="left">
  //           Vaša správa:
  //         </mj-text>
  //         <mj-text text-align="left">
  //           Ďakujeme Vám za správu.
  //         </mj-text>
  //         <mj-text text-align="left">
  //           Ozveme sa čoskoro.
  //         </mj-text>
  //         <mj-text font-weight="bold" text-align="left">
  //           ${origin.toLowerCase()}
  //         </mj-text>
  //       </mj-column>
  //     </mj-section>
  //   </mj-body>
  // </mjml>
  //   `

  //   const { html } = mjml2html(mjmlTemplate)

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

  const filePath = `./src/utils/next_eshop/${order.orderNumber}_${orderDate}.pdf`

  // Write the buffer to a file
  fs.writeFileSync(filePath, new Uint8Array(pdfBuffer))

  console.log(`PDF saved to ${filePath}`)

  const data = {
    from: process.env[`${origin}_MAILER_USERNAME`],
    to: `${order.userEmail}`,
    bcc: bcc,
    subject: `Vaša objednávka ${order.orderNumber}`,
    //html: locale === 'sk' ? sk : locale === 'en' ? en : cz,
    html: orderEmail,
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
