const time = new Date()

const passwordReset = (email: string, url: string) => {
  const data = {
    from: process.env.LIBRO_EMAIL_FROM,
    to: email,
    subject: 'Obnova hesla',
    html: `<div>
   <p>Obnovte si heslo cez link nižšie</p>
   <a href=${url}>Link</a>
   <p>Librosophia</p>
   </div>`,
  }

  return data
}

const adminMail = (name: string, email: string, username: string) => {
  const data = {
    from: process.env.LIBRO_EMAIL_FROM,
    to: process.env.NODEJS_BCC,
    subject: `Nová registrácia ${name}`,
    text: `${email}`,
    html: `<div>
   <p>Na Librosophii sa registroval nový užívateľ</p>
   <p>užívateľské meno: ${username}</p>
   <p>meno: ${name}</p>
   <p>email: ${email}</p>
   <p>čas: ${time}</p>
   </div>`,
  }

  return data
}

const userMail = (
  name: string,
  email: string,
  username: string,
  registerURL: string
) => {
  const data = {
    from: process.env.LIBRO_EMAIL_FROM,
    to: `${email}`,
    subject: `Vitaj na Librospohia ${name}`,
    html: `<div>
    <p>Vitaj na Librosophia</p>
    <p>užívateľské meno: ${username}</p>
    <p>Dokončite svoju registráciu  kliknutím na link</p>
    <p>Link: ${registerURL}</p>
    <p>meno: ${name}</p>
    <p>email: ${email}</p>
    <p>čas: ${time}</p>
    </div>`,
  }

  return data
}

export { passwordReset, adminMail, userMail }
