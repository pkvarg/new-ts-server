import { Order } from './types'
import fs from 'fs'

const userMail = async (order: Order, origin: string, pdfBase64: string, email: string) => {
  // const sk = `<div>
  //   <p>Dobrý deň ${order.shippingInfo.name} </p>
  //   <p>Váš email: ${order.userEmail}</p>
  //      <p>Váš telefón: ${order.shippingInfo.phone} </p>
  //   <p>Vaša správa: </p>
  //   <p>Ďakujeme Vám za správu.</p
  //   <p>Ozveme sa čoskoro.</p>
  //   <p>${origin.toLowerCase()}</p>
  //   </div>`

  const bcc = [process.env[`${origin}_MAILER_USERNAME`]]
  const date = new Date()

  const adminNewUserNotification = `<div>
    <p>Hi Admin </p>
    <p>New User logged in: </p>
    <p>Email: ${email}</p>
    <p>Time: ${date} </p>
     <p>${origin.toLowerCase()}</p>
    </div>`

  if (Object.keys(order).length > 0) {
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

    const pdfBuffer = Buffer.from(pdfBase64, 'base64')
    const orderDate = date.toISOString()

    const filePath = `./src/utils/next_eshop/${order.orderNumber}_${orderDate}.pdf`

    // Write the buffer to a file
    fs.writeFileSync(filePath, new Uint8Array(pdfBuffer))

    console.log(`PDF saved to ${filePath}`)
    const dataOrderEmail = {
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
    console.log('Mailer Data', dataOrderEmail)

    return dataOrderEmail
  }

  const dataNewUserAdminNotification = {
    from: process.env[`${origin}_MAILER_USERNAME`],
    to: bcc,
    subject: `New User: ${email}`,
    html: adminNewUserNotification,
  }

  console.log('Mailer Data', dataNewUserAdminNotification)

  return dataNewUserAdminNotification
}

export { userMail }
