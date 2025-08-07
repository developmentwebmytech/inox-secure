import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    })
    console.log("Email sent successfully to:", to)
    return { success: true }
  } catch (error) {
    console.error("Email sending failed:", error)
    console.log("Failed to send email to:", to)
    return { success: false, error }
  }
}

export function generatePassword() {
  return Math.random().toString(36).slice(-8)
}
