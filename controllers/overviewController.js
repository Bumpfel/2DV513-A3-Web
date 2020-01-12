'use strict'

const db = require('../db/mysql')

const controller = {}
const RowsPerPage = 25

const displayFields = ['primaryTitle', 'startYear', 'endYear', 'averageRating', 'numVotes']

controller.getNamesOverview = async (req, res) => {
  getOverview(req, res)
}

controller.getTitlesOverview = async (req, res) => {
  getOverview(req, res)
}

const getOverview = (req, res) => {
  const orderBy = req.query.orderBy || 'id'
  let filter = req.query.filter || 1
  const includeAdult = req.query.includeAdult || false

  const find = req.query.find

  if (find) {
    filter = 'primaryTitle LIKE "%' + find + '%" AND ' + !includeAdult ? '!isAdult' : '' + filter
  } else {
    filter = !includeAdult ? '!isAdult' : '' + filter
  }

  try {
    db.query('SELECT COUNT(id) AS totalRows FROM titles WHERE ' + filter, (err, result, fields) => {
      if (err) console.error(err.message)

      const totalRows = result[0].totalRows

      let page = req.query.page || 0
      page = parseInt(page)

      page = Math.min(page, Math.floor(totalRows / RowsPerPage)) // set to last page of result if page parameter is > last page

      db.query('SELECT genreName FROM genres', (err, genres, fields) => {
        if (err) console.error(err.message)

        db.query('SELECT ' + displayFields + ' FROM titles WHERE ' + filter + ' ORDER BY ' + orderBy + ', numVotes DESC LIMIT ' + RowsPerPage * page + ',' + RowsPerPage, (err, result, fields) => {
          if (err) console.error(err.message)
          res.render('overview', { result, fields, RowsPerPage, page, totalRows, params: new URLSearchParams(req.query).toString(), site: 'Titles', find, genres })
        })
      })
    })
  } catch (error) {
  }
}

module.exports = controller
