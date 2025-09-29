// middlewares/upload.js
const multer = require('multer')

const storage = multer.memoryStorage()

const upload = multer({ storage }).fields([
  { name: 'projectImage', maxCount: 5 },
  { name: 'projectVideo', maxCount: 2 },
  { name: 'project360', maxCount: 1 },
])

module.exports = upload
