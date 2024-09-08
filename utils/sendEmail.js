import nodemailer from "nodemailer"
import { EMAIL_ADDRESS, EMAIL_PASSWORD, NODEMAILER_HOST, NODEMAILER_PORT } from "../config.js"

const sendEmail = async (email, subject, description) => {
  try {
    const transporter = await nodemailer.createTransport({
      // service: "Gmail",
      // host: "smtp.ethereal.email",
      // port: 587,
      host: NODEMAILER_HOST,
      port: NODEMAILER_PORT,
      // secure: false,
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
      // tls: { rejectUnauthorized: false },
    })

    let mailOptions = { from: EMAIL_ADDRESS, to: email, subject, html: description }

    const result = await transporter.sendMail(mailOptions)
    if (result.accepted?.length > 0) {
      return { message: "Email has been sent successfully!", isSend: true }
    }
    if (result.rejected?.length > 0) {
      return { message: "Something went wrong! while sending a mail", error, isSend: false }
    }

  } catch (error) {
    return { message: "Something went wrong! while sending a mail", error, isSend: false }
  }
}

export default sendEmail