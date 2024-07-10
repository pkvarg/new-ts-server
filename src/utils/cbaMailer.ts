const time = new Date()

const userMail = (
  name: string,
  email: string,
  phone: string,
  mailMessage: string,
  locale: string
) => {
  const sk = `<div>
    <p>Dobrý deň ${name}</p>
    <p>Váš email: ${email}</p>
       <p>Váš telefón: ${phone}</p>
    <p>Vaša správa: ${mailMessage}</p>
    <p>Ďakujeme Vám za správu.</p
    <p>Ozveme sa čoskoro.</p>
    <p>miestnacirkev.sk</p>
    </div>`

  const en = `<div>
    <p>Hello ${name}</p>
    <p>Your email: ${email}</p>
        <p>Your phone: ${phone}</p>
    <p>Your message: ${mailMessage}</p>
    <p>Thank you for contacting us.</p
    <p>We will get back to you soon.</p>
    <p>miestnacirkev.sk</p>
    </div>`

  const bcc = [
    `${process.env.CBA_MAILER_USERNAME} , ${process.env.CBA_MAILER_BCC}`,
  ]

  const data = {
    from: process.env.CBA_MAILER_USERNAME,
    to: `${email}`,
    bcc: bcc,
    subject: `miestnacirkev.sk`,

    html: locale === 'sk' ? sk : en,
  }

  return data
}

export { userMail }
