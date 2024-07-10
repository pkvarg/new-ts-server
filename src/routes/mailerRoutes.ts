import express from 'express'
import { mailerController } from './../controllers/mailerController'
import { cbaMailerController } from './../controllers/cbaMailerController'

const router = express.Router()

router.put('/libro/mailer', mailerController)

router.put('/cba/mailer', cbaMailerController)

//router.put('/email', sendEmail)

//router.put('/contact', contactEmail)

export default router
