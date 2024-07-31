import express from 'express'
import { libroMailerController } from '../controllers/libroMailerController'

import { mailerController } from '../controllers/mailerController'

const router = express.Router()

router.put('/libro/mailer', libroMailerController)

router.put('/universal/mailer', mailerController)

//router.put('/email', sendEmail)

//router.put('/contact', contactEmail)

export default router
