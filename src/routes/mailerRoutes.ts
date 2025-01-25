import express from 'express'
import { libroMailerController } from '../controllers/libroMailerController'

import { mailerController } from '../controllers/mailerController'
import { next_eshopController } from '../controllers/next_eshopController'

const router = express.Router()

router.put('/libro/mailer', libroMailerController)

router.put('/universal/mailer', mailerController)

router.put('/next_eshop/mailer', next_eshopController)
router.post('/next_eshop/mailer', next_eshopController)

//router.put('/email', sendEmail)

//router.put('/contact', contactEmail)

export default router
