const fs = require('fs')
const path = require('path')

/**
 * Load an email template from the templates directory.
 * @param {string} templateName - The name of the template file
 * @param {object} variables - Key-value pairs to replace in the template.
 * @returns {string} - The content of the email template.
 */

const loadTemplate = (templateName, variables = {}) => {
  const templatePath = path.join(__dirname, '../views/Template', templateName)
  let html = fs.readFileSync(templatePath, 'utf-8')

  // Replace placeholders in the format ${key}
  Object.keys(variables).forEach((key) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, 'g')
    html = html.replace(regex, variables[key])
  })

  return html
}

module.exports = { loadTemplate }
