const userMail = (
  name: string,
  email: string,
  phone: string,
  mailMessage: string,
  locale: string,
  origin: string
) => {
  const sk = `<div>
    <p>Dobrý deň ${name}</p>
    <p>Váš email: ${email}</p>
       <p>Váš telefón: ${phone}</p>
    <p>Vaša správa: ${mailMessage}</p>
    <p>Ďakujeme Vám za správu.</p
    <p>Ozveme sa čoskoro.</p>
    <p>${origin.toLowerCase()}</p>
    </div>`

  const en = `<div>
    <p>Hello ${name}</p>
    <p>Your email: ${email}</p>
        <p>Your phone: ${phone}</p>
    <p>Your message: ${mailMessage}</p>
    <p>Thank you for contacting us.</p
    <p>We will get back to you soon.</p>
     <p>${origin.toLowerCase()}</p>
    </div>`

  let bcc = []

  if (origin === 'MIESTNACIRKEV.SK') {
    bcc = [
      process.env[`${origin}_MAILER_USERNAME`],
      process.env[`${origin}_MAILER_BCC`],
    ]
  } else {
    bcc = [process.env[`${origin}_MAILER_USERNAME`]]
  }

  const data = {
    from: process.env[`${origin}_MAILER_USERNAME`],
    to: email,
    bcc: bcc,
    subject: `${origin.toLowerCase()}`,
    html: locale === 'sk' ? sk : en,
  }

  console.log('Maler', bcc, data)

  return data
}

export { userMail }
