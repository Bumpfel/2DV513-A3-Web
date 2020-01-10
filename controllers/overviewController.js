const db = require('../db/mysql')

const controller = {}
const RowsPerPage = 25

controller.getNamesOverview = async (req, res) => {
  getOverview(req, res, 'Names')
}

controller.getTitlesOverview = async (req, res) => {
  getOverview(req, res, 'Titles')
}

const getOverview = (req, res, table) => {
  let page = req.query.page || 0
  page = parseInt(page)
  const orderBy = req.query.orderBy || 'id'

  db.query('SELECT COUNT(id) AS totalRows FROM titles', (err, result, fields) => {
    if (err) console.error(err.message)

    const totalRows = result[0].totalRows
    db.query('SELECT * FROM titles ORDER BY ' + orderBy + ' LIMIT ' + RowsPerPage * page + ',' + RowsPerPage, (err, result, fields) => {
      if (err) console.error(err.message)
      res.render('overview', { result, fields, RowsPerPage, page, totalRows, orderBy, table })
    })
  })
}

module.exports = controller
