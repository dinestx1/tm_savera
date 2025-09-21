function otpEmailTemplate(otp, email) {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TM SAVERA Admin OTP</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        font-family: 'Inter', sans-serif;
        background-color: #e6f0fa;
        color: #0f172a;
      }

      /* Preheader */
      .preheader {
        display: none;
      }

      /* Container */
      .container {
        max-width: 600px;
        margin: 1.5rem auto;
        background: linear-gradient(180deg, #ffffff, #e6f0fa);
        border-radius: 1.5rem;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      /* Header gradient */
      .header-gradient {
        height: 8px;
        background: linear-gradient(to right, #1e40af, #3b82f6, #60a5fa);
      }

      /* Main card */
      .card {
        padding: 2.5rem;
        position: relative;
        background: #ffffff;
      }

      /* Background pattern */
      .bg-pattern {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.06;
        pointer-events: none;
      }

      .bg-pattern svg {
        width: 100%;
        height: 100%;
      }

      /* Titles */
      .title {
        text-align: center;
        margin-bottom: 1.5rem;
      }

      .title h1 {
        font-size: 2rem;
        font-weight: 700;
        color: #1e40af;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .title p {
        color: #475569;
        font-size: 0.95rem;
        max-width: 90%;
        margin: 0 auto;
      }

      /* Divider */
      .divider {
        height: 2px;
        background: linear-gradient(to right, transparent, #3b82f6, transparent);
        opacity: 0.3;
        margin: 2rem 0;
      }

      /* OTP section */
      .otp-section {
        text-align: center;
        position: relative;
        z-index: 10;
      }

      .otp-section h2 {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1e40af;
        margin-bottom: 0.75rem;
      }

      .otp-section p {
        color: #475569;
        font-size: 0.9rem;
        max-width: 90%;
        margin: 0 auto 1.5rem;
      }

      .otp-box {
        display: inline-block;
        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        border-radius: 1.2rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .otp-box:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
      }

      .otp-code {
        font-size: 2.8rem;
        font-weight: 800;
        color: #1e40af;
        letter-spacing: 0.3rem;
        padding: 1rem 2.5rem;
        border: 3px dashed #60a5fa;
        border-radius: 0.8rem;
        background: #ffffff;
        display: inline-block;
        transition: background 0.3s ease;
      }

      .otp-code:hover {
        background: #eff6ff;
      }

      .otp-expire {
        font-size: 0.85rem;
        color: #475569;
        margin-top: 1rem;
        font-style: italic;
      }

      .login-button {
        display: inline-block;
        background: linear-gradient(to right, #1e40af, #3b82f6);
        color: #ffffff;
        font-weight: 600;
        font-size: 0.95rem;
        padding: 0.8rem 2.5rem;
        border-radius: 0.8rem;
        text-decoration: none;
        transition: all 0.3s ease;
        margin-bottom: 1.5rem;
      }

      .login-button:hover {
        background: linear-gradient(to right, #3b82f6, #1e40af);
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      }

      .otp-section a.support-link {
        color: #3b82f6;
        font-weight: 500;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .otp-section a.support-link:hover {
        color: #1e40af;
      }

      /* Footer */
      .footer {
        background: #0f172a;
        color: #e2e8f0;
        text-align: center;
        padding: 2rem 1rem;
        border-top-left-radius: 1.2rem;
        border-top-right-radius: 1.2rem;
      }

      .logo-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1.2rem;
      }

      .logo-row img {
        width: 32px;
        height: auto;
      }

      .logo-row .logo-p {
        margin: 0;
        font-weight: 700;
        font-size: 1.1rem;
        color: #ffffff;
        text-transform: uppercase;
      }

      .social-icons {
        display: flex;
        justify-content: center;
        gap: 1.8rem;
        margin-bottom: 1.5rem;
      }

      .social-icons img {
        width: 24px;
        opacity: 0.8;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .social-icons img:hover {
        opacity: 1;
        transform: scale(1.3);
      }

      .footer p {
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 1rem;
      }

      .footer .line {
        height: 1px;
        background-color: #1e293b;
        margin: 1.5rem 2rem;
      }

      .footer a {
        color: #94a3b8;
        font-weight: 400;
        text-decoration: none;
        transition: color 0.3s ease;
      }

      .footer a:hover {
        color: #ffffff;
      }

      /* Email client compatibility */
      @media only screen and (max-width: 600px) {
        .container {
          margin: 1rem;
          border-radius: 1rem;
        }

        .card {
          padding: 1.5rem;
        }

        .title h1 {
          font-size: 1.6rem;
        }

        .otp-code {
          font-size: 2.2rem;
          padding: 0.8rem 1.8rem;
        }

        .login-button {
          padding: 0.7rem 2rem;
        }

        .logo-row img {
          width: 28px;
        }

        .logo-row .logo-p {
          font-size: 1rem;
        }
      }
    </style>
  </head>
  <body>
    <!-- Preheader -->
    <div class="preheader">Securely log in to TM SAVERA admin panel with your OTP.</div>

    <!-- Main Container -->
    <div class="container">
      <!-- Header Gradient -->
      <div class="header-gradient"></div>

      <!-- Main Card -->
      <div class="card">
        <!-- Background pattern -->
        <div class="bg-pattern">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="wave" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M0 10 C5 5, 15 15, 20 10"
                  fill="none"
                  stroke="#3b82f6"
                  stroke-width="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        </div>

        <!-- Title -->
        <div class="title">
          <h1>TM SAVERA Admin OTP</h1>
          <p>
            Your exclusive one-time password for secure access to the TM SAVERA admin dashboard.
            Keep it confidential.
          </p>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- OTP Section -->
        <div class="otp-section">
          <h2>Your Secure OTP</h2>
          <p>Valid for 10 minutes. Use it to access the admin panel securely.</p>

          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <p class="otp-expire">Expires in 10 minutes</p>
          </div>

          <a
            href="http://localhost:3000/verification?email=${encodeURIComponent(email)}&otp=${otp}"
            class="login-button"
            >Access Dashboard</a
          >

          <p>
            Did not request this OTP? Contact
            <a href="mailto:support@dinestx.com" class="support-link">support</a> immediately.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="logo-row">
        <img src="https://www.dinestx.com/assets/Logo-QB_aqU2e.webp" alt="TM SAVERA Logo" />
        <p class="logo-p">dinestx</p>
      </div>

      <div class="social-icons">
        <a href="https://www.linkedin.com" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn" />
        </a>
        <a href="https://www.twitter.com" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" />
        </a>
        <a href="https://www.instagram.com" target="_blank">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" />
        </a>
      </div>

      <p>TM SAVERA Admin Panel - Exclusive access for authorized personnel.</p>
      <div class="line"></div>

      <p>© 2025 TM SAVERA. All rights reserved.</p>
      <p><a href="#">Privacy Policy</a> • <a href="#">Terms of Service</a></p>
    </div>
  </body>
</html>
  `
}

module.exports = { otpEmailTemplate }
