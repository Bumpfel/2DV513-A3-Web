// const db = require('../db/mysql')

const controller = {}

controller.getHomePage = (req, res) => {
  res.render('home', {})
}

module.exports = controller
