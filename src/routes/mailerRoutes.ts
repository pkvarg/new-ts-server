import express from 'express'
import { mailerController } from './../controllers/mailerController'

const router = express.Router()

router.put('/libro/mailer', mailerController)

//router.put('/email', sendEmail)

//router.put('/contact', contactEmail)

export default router
