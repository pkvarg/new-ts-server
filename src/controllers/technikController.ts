import express from 'express'
import { transporter } from './../utils/mailerTransport'

const contact = async (req: express.Request, res: express.Response) => {
  const { name, email, phone, message } = req.body

  console.log('subs', name, email, phone, message)

  const nodejsMailerEnvs = {
    host: process.env.TITAN_MAILER_HOST,
    user: process.env.NODEJS_MAILER_USERNAME,
    pass: process.env.NODEJS_MAILER_PASSWORD,
  }

  const data = {
    from: process.env.NODEJS_MAILER_USERNAME,
    to: `${email}`,
    bcc: process.env.NODEJS_BCC,
    subject: `Vaša správa ${email}`,
    html: `<div>
      <p>Dobrý deň.</p>
      <p>užívateľské meno: ${name}</p>
      <p>email: ${email}</p>
      <p>telefón: ${phone}</p>
      <p>Vaša správa: ${message}</p>
      <p>Ozveme sa čoskoro</p>
      <p>Orchester Technik</p>
      </div>`,
  }

  try {
    await transporter(nodejsMailerEnvs).sendMail(data)
    res.json('Success')
  } catch (error: any) {
    res.json(error)
  }
}

export { contact }
