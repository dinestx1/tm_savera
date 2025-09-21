const paramsVerifyOtp = (req, res) => {
  console.log('paramsVerifyOtp hit') // confirm route is hit
  console.log('query:', req.query)
  res.send('OK')
}
module.exports = { paramsVerifyOtp }
