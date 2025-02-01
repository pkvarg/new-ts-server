import express from 'express'
import { transporter } from '../utils/mailerTransport'
import { eshopMailer, eshopContact } from '../utils/next_eshop/next_eshop_mailer'

// email/universal/mailer

const next_eshopController = async (req: express.Request, res: express.Response) => {
  const { order, origin, pdf, email, action } = req.body

  //console.log('body', order, origin, pdf, order, email, action)

  const nodejsMailerEnvs = {
    host: process.env.TITAN_MAILER_HOST,
    user: process.env[`${origin}_MAILER_USERNAME`],
    pass: process.env[`${origin}_MAILER_PASSWORD`],
  }

  let mailData

  if (action === 'newContact') {
    mailData = eshopContact(origin, email, action)
  } else {
    mailData = eshopMailer(order, origin, pdf, email, action)
  }

  try {
    await transporter(nodejsMailerEnvs).sendMail(await mailData)
    res.json({ status: 'Success' })
  } catch (error: any) {
    console.error('Error sending email:', error)
    res.json({ status: 'Error', error })
  }
}

export { next_eshopController }
