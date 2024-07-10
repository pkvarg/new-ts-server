import express from 'express'
import { pdfSendController } from '../controllers/mdController.js'

const router = express.Router()

router.put('/pdf', pdfSendController)

//router.put('/email', sendEmail)

//router.put('/contact', contactEmail)

export default router
