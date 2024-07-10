import express from 'express'

import { contact } from './../controllers/technikController'

const router = express.Router()

router.put('/contact', contact)

export default router
