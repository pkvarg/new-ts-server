import { Order } from './types'
import fs from 'fs'

const date = new Date()

export const eshopMailer = async (
  order: Order,
  origin: string,
  pdfBase64: string,
  email: string,
  action: string,
) => {
  const bcc = [process.env[`${origin}_MAILER_USERNAME`]]
  if (action === 'newOrder' && Object.keys(order).length > 0) {
    const productsWithFiles = order.products
      .filter((product: any) => product.filePath !== null)
      .reduce((uniqueProducts: any[], product: any) => {
        if (!uniqueProducts.some((uniqueProduct) => uniqueProduct.id === product.id)) {
          uniqueProducts.push(product) // Add to the
        }
        return uniqueProducts
      }, [])

    console.log('prods w files', productsWithFiles.length)

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
    ${
      productsWithFiles.length > 0 &&
      `<p>
      Vaše produkty na stiahnutie nájdete na 
      <a href='http://localhost:3001/my-downloads' target='_blank'>Moje Produkty</a>
      </p>`
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
    // console.log('Mailer Data', dataOrderEmail)

    return dataOrderEmail
  }

  if (action === 'newUser') {
    const adminNewUserNotification = `<div>
    <p>Hi Admin </p>
    <p>New User logged in: </p>
    <p>Email: ${email}</p>
    <p>Time: ${date} </p>
     <p>${origin.toLowerCase()}</p>
    </div>`

    const dataNewUserAdminNotification = {
      from: process.env[`${origin}_MAILER_USERNAME`],
      to: bcc,
      subject: `New User: ${email}`,
      html: adminNewUserNotification,
    }

    console.log('Mailer Data', dataNewUserAdminNotification)

    return dataNewUserAdminNotification
  }

  if (action === 'lowProductCount') {
    const adminLowProductCount = `<div>
    <p>Hi Admin </p>
    <p>Low Product Count qty: ${pdfBase64} </p>
    <p>Product: ${email}</p>
    <p>Time: ${date} </p>
     <p>${origin.toLowerCase()}</p>
    </div>`

    const dataAdminLowProductCount = {
      from: process.env[`${origin}_MAILER_USERNAME`],
      to: bcc,
      subject: `Low Product Count`,
      html: adminLowProductCount,
    }

    console.log('Mailer Data', dataAdminLowProductCount)

    return dataAdminLowProductCount
  }

  if (action === 'paidByStripe') {
    const orderPaidByStripe = `<div style="font-size: 17.5px;">
      <p style="font-size: 20px;">Vaša objednávka</p>  
      <p>Dobrý deň,</p>
      <p>${order.shippingInfo.name}</p>

       <p>Vaša objednávka číslo ${order.orderNumber} bola uhradená.</p>
        
       
        
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
    
   
      
        
        <p>Ďakujeme za Váš nákup!</p
       
        <p>${origin.toLowerCase()}</p>
        </div>`

    const dataOrderPaidByStripe = {
      from: process.env[`${origin}_MAILER_USERNAME`],
      to: `${order.userEmail}`,
      bcc: bcc,
      subject: `Objednávka uhradená ${order.orderNumber}`,
      html: orderPaidByStripe,
    }
    console.log('Mailer Data', dataOrderPaidByStripe)

    return dataOrderPaidByStripe
  }

  if (action === 'stripeError') {
  }

  if (action === 'orderPackedAndSent') {
  }
}

export const eshopContact = async (
  origin: string,
  email: {
    name: string
    email: string
    phone: string
    message: string
  },
  action: string,
) => {
  const bcc = [process.env[`${origin}_MAILER_USERNAME`]]
  if (action === 'newContact') {
    const sk = `<div>
    <p>Dobrý deň ${email.name} </p>
    <p>Váš email: ${email.email}</p>
       <p>Váš telefón: ${email.phone} </p>
    <p>Vaša správa: ${email.message}</p>
    <p>Ďakujeme Vám za správu.</p
    <p>Ozveme sa čoskoro.</p>
    <p>${origin.toLowerCase()}</p>
    </div>`

    const dataNewContact = {
      from: process.env[`${origin}_MAILER_USERNAME`],
      to: email.email,
      bcc,
      subject: `New message from: ${email.email}`,
      html: sk,
    }

    console.log('Mailer Data', dataNewContact)

    return dataNewContact
  }
}
