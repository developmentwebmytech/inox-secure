import nodemailer from "nodemailer"
import path from "path"

const smtpHost = process.env.SMTP_HOST
const smtpPort = Number(process.env.SMTP_PORT)
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS


// Validate SMTP config
if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
  throw new Error("Missing SMTP environment variables.")
}
if (isNaN(smtpPort)) {
  throw new Error("SMTP_PORT must be a valid number.")
}

// Setup transporter
const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
})

interface OrderEmailData {
  to: string
  orderNumber: string
  customerName: string
 paymentMethod: string
 paymentStatus: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  isNewUser: boolean
  credentials?: {
    email: string
    password: string
  }
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString()}</td>
    </tr>
  `
    )
    .join("")

  const credentialsSection =
    data.isNewUser && data.credentials
      ? `
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #0042adef; margin-bottom: 10px;">Your Account Credentials</h3>
      <p>We've created an account for you to track your orders:</p>
      <p><strong>Email:</strong> ${data.credentials.email}</p>
      <p><strong>Password:</strong> ${data.credentials.password}</p>
      <p style="font-size: 14px; color: #666;">Please change your password after logging in.</p>
    </div>
  `
      : ""

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Order Confirmation - INOX Store</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <!-- Logo with blue background -->
  <div style="background-color: #0042adef; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 30px;">
    <img src="cid:inoxlogo" alt="INOX Logo" style="max-width: 180px;" />
  </div>

  <h2 style="color: #0042adef;">Order Confirmation</h2>
  
  <p>Dear ${data.customerName},</p>
  <p>Thank you for your order! We're excited to confirm that we've received your order and it's being processed.</p>
  
  <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #0042adef;">Order Details</h3>
    <p><strong>Order Number:</strong> ${data.orderNumber}</p>
    <p><strong>Payment Method:</strong>${data.paymentMethod}</p>
    <p><strong>Payment Status:</strong>${data.paymentStatus}</p>
  </div>

  ${credentialsSection}

  <h3 style="color: #0042adef;">Order Summary</h3>
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <thead>
      <tr style="background-color: #0042adef; color: white;">
        <th style="padding: 12px; text-align: left;">Product</th>
        <th style="padding: 12px; text-align: center;">Qty</th>
        <th style="padding: 12px; text-align: right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
    <tfoot>
      <tr style="background-color: #f8f9fa; font-weight: bold;">
        <td colspan="2" style="padding: 12px; text-align: right;">Total:</td>
        <td style="padding: 12px; text-align: right; color: #0042adef;">₹${data.total.toLocaleString()}</td>
      </tr>
    </tfoot>
  </table>

  <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #0042adef; margin-top: 0;">What's Next?</h3>
    <ul style="margin: 0; padding-left: 20px;">
      <li>We'll process your order within 1–2 business days</li>
      <li>You'll receive a shipping confirmation with tracking details</li>
      <li>Your order will be delivered within 3–7 business days</li>
      <li>Pay cash when you receive your order</li>
    </ul>
  </div>

  <p>If you have any questions about your order, please contact us at info@inoxstore.com or +91 9680849577.</p>
  <p>Thank you for choosing INOX Store!</p>

  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
    <p>INOX Store – Premium Electronics & Appliances</p>
    <p>Jaipur, Rajasthan | info@inoxstore.com</p>
  </div>
</body>
</html>`;


  try {
    await transporter.sendMail({
      from: '"INOX Store" <info@inoxsecure.com>',
      to: data.to,
      subject: `Order Confirmation - ${data.orderNumber}`,
      html,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(process.cwd(), "public", "logo", "Inoxsecurelogowhite.png"),
          cid: "inoxlogo",
        },
      ],
    })
    console.log("✅ Order confirmation email sent to:", data.to)
  } catch (error) {
    console.error("❌ Failed to send order confirmation email:", error)
    throw error
  }
}

export async function sendEmail({
  to,
  subject,
  html,
 }: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `<info@inoxsecure.com>`, // ✅ fallback
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Email sending failed:", error);
    return { success: false, error: error.message };
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`

  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
      <p>You requested a password reset for your InoxSecure account.</p>
      <p>Click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
      </div>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #666; font-size: 12px;">InoxSecure Team</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: "Reset Your Password - InoxSecure",
    html,
  })
}
