const rateLimit = require('express-rate-limit')

// Example: max 5 feedbacks per IP in 1 hour
const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2,
  message: { error: 'Too many feedback submissions from this IP, try again later' },
})

module.exports = { feedbackLimiter }
