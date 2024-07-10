// src/index.js
import express from 'express'
import http from 'http'
import bodyPaser from 'body-parser'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './router'
import mailerRoutes from './routes/mailerRoutes'
import technikRoutes from './routes/technikRoutes'

import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const app = express()

app.use(
  cors({
    credentials: true,
    origin: [
      'http://localhost:3000',
      'https://localhost:3000',
      'http://localhost:5173',
      'https://localhost:5173',
      'https://cba.pictusweb.sk',
      'https://pictusweb.sk',
      'https://cestazivota.sk',
      'https://ioana-illustrations.eu',
      'https://ecommerce.pictusweb.sk',
      'https://katolickaviera.sk',
      'https://svedkovia.sk',
      'https://duhovyrod.sk',
      'https://md.pictusweb.sk',
      'https://michaldovala.sk',
    ],
  })
)

app.use(compression())
app.use(cookieParser())
app.use(bodyPaser.json())

const server = http.createServer(app)

const PORT = process.env.PORT

server.listen(PORT, () => {
  console.log(`Server is really running on http://localhost:${PORT}/`)
})

mongoose.Promise = Promise
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.on('error', (error: Error) => console.log(error))

app.use('/', router())
app.use('/email', mailerRoutes)
app.use('/technik', technikRoutes)
// app.use(express.json())
// app.use('/uploads', express.static(path.resolve('uploads')))

// app.use('/api/md')

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(__dirname + '/public/server.png')
})
