import express from 'express'
import { transporter } from '../utils/mailerTransport'
import { userMail } from '../utils/next_eshop/next_eshop_mailer'

// email/universal/mailer

const next_eshopController = async (req: express.Request, res: express.Response) => {
  const { order, origin, pdf, email } = req.body
  //const { order, origin } = req.body

  // console.log('body', order, origin)

  const nodejsMailerEnvs = {
    host: process.env.TITAN_MAILER_HOST,
    user: process.env[`${origin}_MAILER_USERNAME`],
    pass: process.env[`${origin}_MAILER_PASSWORD`],
  }

  // const mailData = userMail(name, email, phone, mailMessage, locale, origin)
  const mailData = userMail(order, origin, pdf, email)
  //const mailData = userMail(order, origin)

  try {
    await transporter(nodejsMailerEnvs).sendMail(await mailData)
    res.json({ status: 'Success' })
  } catch (error: any) {
    console.log('error', error)
    res.json({ status: 'Error', error })
  }
}

export { next_eshopController }
