const path = require('path')
const { loadTemplate } = require('./loadTemplate')
const { otpEmailTemplate } = require('../views/Template/otp')

// // Otp Email Templates
// const otpHtml = loadTemplate('otp.html', { otp: data.otp })

const emailTemplate = (type, data) => {
  switch (type) {
    case 'existingUserOtp':
      return {
        subject: 'Your OTP Verification Code',
        text: `Your OTP is: ${data.otp} `,
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
		  <h2 style="text-align: center; color: #007bff; margin-bottom: 20px;">Your OTP Code</h2>
		  <p style="font-size: 16px; color: #333; text-align: center;">
		    Use the code below to complete your verification. This code is valid for the next 5 minutes.
		  </p>
		  <div style="text-align: center; margin: 20px 0;">
		    <span style="display: inline-block; font-size: 24px; color: #ffffff; background-color: #007bff; padding: 10px 20px; border-radius: 5px; font-weight: bold; letter-spacing: 2px;">
		      ${data.otp}
		    </span>
		  </div>
		  <p style="font-size: 14px; color: #555; text-align: center;">
		    If you didn’t request this code, you can safely ignore this email.
		  </p>
		  <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
		  <p style="font-size: 12px; color: #aaa; text-align: center;">
		    This is an automated message. Please do not reply to this email.
		  </p>
		</div>`,
      }

    case 'newUserOtp':
      return {
        subject: 'Your OTP Verification Code',
        text: `Your OTP is: ${data.otp} `,
        html: otpEmailTemplate(data.otp, data.email),
        // html: loadTemplate('otp.html', { otp: data.otp, email: data.email }),
        attachments: [
          // {
          //   filename: 'digital-nomad.svg',
          //   path: path.join(__dirname, 'assets', 'digital-nomad.svg'),
          //   cid: 'auth', // This must match the `cid:auth` in the HTML
          // },
        ],
      }

    case 'order_success':
      return {
        subject: 'Order Confirmation',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #28a745; margin-bottom: 20px;">Order Confirmed!</h2>
            <p style="font-size: 16px; color: #333; text-align: center;">
              Thank you for your purchase. Your order <strong>#${data.orderId}</strong> has been successfully placed.
            </p>
            <p style="text-align: center; font-size: 14px; color: #555;">
              We will send you an update once your order is shipped.
            </p>
          </div>
        `,
      }
  }
}

module.exports = { emailTemplate }
