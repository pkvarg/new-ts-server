import express from 'express'
import { transporter } from './../utils/mailerTransport'
import { userMail } from './../utils/cbaMailer'

const cbaMailerController = async (
  req: express.Request,
  res: express.Response
) => {
  const { name, email, phone, mailMessage, locale } = req.body

  const nodejsMailerEnvs = {
    host: process.env.TITAN_MAILER_HOST,
    user: process.env.CBA_MAILER_USERNAME,
    pass: process.env.CBA_MAILER_PASSWORD,
  }

  const mailData = userMail(name, email, phone, mailMessage, locale)

  try {
    await transporter(nodejsMailerEnvs).sendMail(mailData)

    res.json({ status: 'Success' })
  } catch (error: any) {
    console.log('error', error)
    res.json({ status: 'Error', error })
  }
}

export { cbaMailerController }
