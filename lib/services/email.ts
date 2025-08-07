import * as nodemailer from "nodemailer"

// Create transporter for Mailtrap
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
    port: Number.parseInt(process.env.SMTP_PORT || "2525"),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  }

 
  return nodemailer.createTransport(config)
}

// Email templates
export const emailTemplates = {
  orderConfirmation: (orderData: any) => ({
    subject: `Order Confirmation - ${orderData.orderNumber || "N/A"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0;">Thank you for your purchase</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Order Details</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Order Number:</strong> ${orderData.orderNumber || "N/A"}</p>
            <p><strong>Order Date:</strong> ${orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : "N/A"}</p>
            <p><strong>Total Amount:</strong> ₹${orderData.total || "0"}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod || "N/A"}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #6b7280;">Thank you for your order!</p>
          </div>
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0;">Thank you for shopping with us!</p>
        </div>
      </div>
    `,
  }),

  orderShipped: (orderData: any) => ({
    subject: `Your Order Has Shipped - ${orderData.orderNumber || "N/A"}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Shipped!</h1>
          <p style="color: white; margin: 10px 0 0 0;">Your order is on its way</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Shipping Details</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Order Number:</strong> ${orderData.orderNumber || "N/A"}</p>
            <p><strong>Tracking Number:</strong> ${orderData.trackingNumber || "N/A"}</p>
            <p><strong>Carrier:</strong> ${orderData.carrier || "N/A"}</p>
          </div>
        </div>
      </div>
    `,
  }),

  welcomeEmail: (userData: any) => ({
    subject: "Welcome to Our Store!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome ${userData?.name || "there"}!</h1>
          <p style="color: white; margin: 10px 0 0 0;">Thank you for joining our community</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Get Started</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p>Welcome to our store! Here's what you can do:</p>
            <ul style="color: #6b7280;">
              <li>Browse our latest collections</li>
              <li>Add items to your wishlist</li>
              <li>Track your orders</li>
              <li>Manage your account settings</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/products" 
               style="display: inline-block; background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Start Shopping
            </a>
          </div>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetData: any) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const resetUrl = resetData?.resetUrl || `${baseUrl}/reset-password?token=${resetData?.token || ""}`

    
    return {
      subject: "Reset Your Password - PARPRA",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f3f4f6;">
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: white;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #0f766e, #0d9488); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Password Reset</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Reset your account password</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px; font-size: 24px;">Hello ${resetData?.name || "there"}!</h2>
            
            <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <p style="margin-bottom: 20px; color: #374151; font-size: 16px; line-height: 1.6;">
                You requested a password reset for your PARPRA account. Click the button below to create a new password:
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${resetUrl}" 
                   style="display: inline-block; background-color: #0f766e; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; text-align: center; min-width: 200px;">
                  Reset My Password
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
                ⏰ This link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <!-- Fallback Link -->
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0f766e;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0; font-weight: bold;">
                Button not working? Copy and paste this link:
              </p>
              <p style="color: #0f766e; font-size: 14px; word-break: break-all; margin: 0; font-family: monospace;">
                ${resetUrl}
              </p>
            </div>
            
            <!-- Security Notice -->
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; border: 1px solid #f59e0b;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                🔒 If you didn't request this password reset, please ignore this email or contact our support team immediately.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #1f2937; padding: 30px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 16px;">Thank you for using PARPRA!</p>
            <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
              This email was sent from ${baseUrl}
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    }
  },

  newsletter: (content: any) => ({
    subject: content?.subject || "Newsletter Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">${content?.title || "Newsletter"}</h1>
          <p style="color: white; margin: 10px 0 0 0;">${content?.subtitle || "Latest updates"}</p>
        </div>
        
        <div style="padding: 30px; background: #f9fafb;">
          ${content?.body || "<p>Thank you for subscribing to our newsletter!</p>"}
        </div>
        
        <div style="background: #1f2937; padding: 20px; text-align: center;">
          <p style="color: #9ca3af; margin: 0;">Thank you for reading!</p>
        </div>
      </div>
    `,
  }),
}

// Email service functions
export const emailService = {
  async sendEmail(to: string, template: { subject: string; html: string }) {
    try {
     

      // Validate environment variables
      if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
        const error =
          "Mailtrap credentials not configured. Please set MAILTRAP_USER and MAILTRAP_PASS environment variables."
        
        throw new Error(error)
      }

      const transporter = createTransporter()

      const fromEmail =
        process.env.MAILTRAP_FROM_EMAIL || process.env.NEXT_PUBLIC_MAILTRAP_FROM_EMAIL || "noreply@parpra.com"

      const mailOptions = {
        from: fromEmail,
        to,
        subject: template.subject,
        html: template.html,
      }

     

      const result = await transporter.sendMail(mailOptions)

     
      return { success: true, messageId: result.messageId, response: result.response }
    } catch (error) {
      console.error("❌ Error sending email:", error)

      if (error instanceof Error) {
        console.error("Error name:", error.name)
        console.error("Error message:", error.message)
        console.error("Error stack:", error.stack)
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred while sending email",
      }
    }
  },

  async sendOrderConfirmation(userEmail: string, orderData: any) {
   
    const template = emailTemplates.orderConfirmation(orderData)
    return this.sendEmail(userEmail, template)
  },

  async sendOrderShipped(userEmail: string, orderData: any) {

    const template = emailTemplates.orderShipped(orderData)
    return this.sendEmail(userEmail, template)
  },

  async sendWelcomeEmail(userEmail: string, userData: any) {
  
    const template = emailTemplates.welcomeEmail(userData)
    return this.sendEmail(userEmail, template)
  },

  async sendPasswordReset(userEmail: string, resetData: any) {
    
    const template = emailTemplates.passwordReset(resetData)
    return this.sendEmail(userEmail, template)
  },

  async sendNewsletter(userEmail: string, content: any) {
   
    const template = emailTemplates.newsletter(content)
    return this.sendEmail(userEmail, template)
  },
}
