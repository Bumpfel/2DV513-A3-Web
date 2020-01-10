const db = require('../db/mysql')

const controller = {}
const RowsPerPage = 25

const Table = { titles: 'Titles', names: 'Names' }

controller.getNamesOverview = async (req, res) => {
  getOverview(req, res, Table.names)
}

controller.getTitlesOverview = async (req, res) => {
  getOverview(req, res, Table.titles)
}

const getOverview = (req, res, table) => {
  let page = req.query.page || 0
  page = parseInt(page)
  const orderBy = req.query.orderBy || 'id'
  // const filter = req.query.filter || 1

  const find = req.query.find

  let filter = 1
  if (find) {
    if (table === Table.titles) {
      filter = 'primaryTitle LIKE "%' + find + '%"'
    } else if (table === Table.names) {
      filter = 'primaryName LIKE "%' + find + '%"'
    }
  }

  try {
    db.query('SELECT COUNT(id) AS totalRows FROM titles WHERE ' + filter, (err, result, fields) => {
      if (err) console.error(err.message)

      const totalRows = result[0].totalRows
      db.query('SELECT * FROM titles WHERE ' + filter + ' ORDER BY ' + orderBy + ' LIMIT ' + RowsPerPage * page + ',' + RowsPerPage, (err, result, fields) => {
        if (err) console.error(err.message)
        res.render('overview', { result, fields, RowsPerPage, page, totalRows, orderBy, table })
      })
    })
  } catch (error) {
  }
}

module.exports = controller
