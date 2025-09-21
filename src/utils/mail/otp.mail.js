const nodemailer = require('nodemailer')
const { emailTemplate } = require('./template.mail')
// const { google } = require('googleapis')

// const oAuth2Client = new google.auth.OAuth2(
//   process.env.OAUTH_CLIENT_ID,
//   process.env.OAUTH_CLIENT_SECRET,
//   process.env.OAUTH_REDIRECT_URI
// )

// oAuth2Client.setCredentials({ refresh_token: process.env.OAUTH_REFRESH_TOKEN })

// Generate a new 6-digit OTP
const newOtp = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString()
}

const sendEmail = async (emailOrPhone, type, data) => {
  // Transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_ADMINISTRATOR,
      pass: process.env.SMTP_ADMINISTRATOR_PASS,
    },
  })

  const Template = emailTemplate(type, data)

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: emailOrPhone,
    subject: Template.subject,
    html: Template.html,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${emailOrPhone} for ${type}`)
    return { success: true, message: `${type} email sent successfully` }
  } catch (error) {
    console.error(`Error sending ${type} email:`, error.message)
    return { success: false, message: `Failed to send ${type} email`, error }
  }
}

module.exports = { newOtp, sendEmail }
