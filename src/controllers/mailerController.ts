import express from 'express'
import { transporter } from '../utils/mailerTransport'
import { userMail } from '../utils/mailer'

// email/universal/mailer

const mailerController = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, email, phone, mailMessage, locale, origin } = req.body

  console.log('orig', origin)

  const nodejsMailerEnvs = {
    host: process.env.TITAN_MAILER_HOST,
    user: process.env[`${origin}_MAILER_USERNAME`],
    pass: process.env[`${origin}_MAILER_PASSWORD`],
  }

  console.log(nodejsMailerEnvs)

  const mailData = userMail(name, email, phone, mailMessage, locale, origin)

  try {
    await transporter(nodejsMailerEnvs).sendMail(mailData)
    res.json({ status: 'Success' })
  } catch (error: any) {
    console.log('error', error)
    res.json({ status: 'Error', error })
  }
}

export { mailerController }
