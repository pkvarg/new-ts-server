import nodemailer from 'nodemailer'

interface Envs {
  host: string
  user: string
  pass: string
}

export const transporter = (envs: Envs) => {
  return nodemailer.createTransport({
    pool: true,
    host: envs.host,
    port: 465,
    secure: true, // use TLS
    auth: {
      user: envs.user,
      pass: envs.pass,
    },
  })
}
