'use strict'

const db = require('../db/mysql')

const controller = {}
const RowsPerPage = 25

const displayFields = ['primaryTitle', 'startYear', 'averageRating', 'numVotes'] // 'titleTypeId'

controller.getNamesOverview = async (req, res) => {
  getOverview(req, res)
}

controller.getTitlesOverview = async (req, res) => {
  getOverview(req, res)
}

const getOverview = (req, res) => {
  const orderBy = req.query.orderBy || 'titles.id'
  const includeAdult = req.query.includeAdult || false

  const find = req.query.find
  let filter
  filter = !includeAdult && !req.query.genre === 'Adult' ? '!isAdult ' + (find ? 'AND ' : '') : ''
  if (find) {
    if (req.query.exact) {
      filter += 'primaryTitle = "' + find + '"'
    } else {
      filter += 'primaryTitle LIKE "%' + find + '%"'
    }
  }

  let mainQuery
  if (req.query.genre) {
    mainQuery = 'FROM titles JOIN titlegenrerelations ON titleId = titles.id JOIN genres ON genres.id = titlegenrerelations.genreId WHERE genreName = "' + req.query.genre + '"' + (filter.length > 0 ? ' AND ' : '') + filter
  } else {
    mainQuery = 'FROM titles WHERE ' + (filter.length ? filter : 1)
  }

  const query = 'SELECT COUNT(titles.id) AS totalRows ' + mainQuery
  // console.log(query)

  db.query(query, (err, result, fields) => {
    if (err || !result) {
      console.error(err.message)
      return
    }

    const totalRows = result[0].totalRows

    let page = req.query.page || 0
    page = parseInt(page)

    page = req.query.page ? Math.min(page, Math.floor((totalRows - 1) / RowsPerPage)) : 0 // set to last page of result if page parameter is > last page

    db.query('SELECT genreName FROM genres', (err, genres, fields) => {
      if (err) console.error(err.message)

      const query = 'SELECT ' + displayFields + ' AS totalRows ' + mainQuery + ' ORDER BY ' + orderBy + ', numVotes DESC LIMIT ' + RowsPerPage * page + ',' + RowsPerPage
      // console.log(query)

      db.query(query, (err, result, fields) => {
        if (err) console.error(err.message)
        res.render('overview', { result, fields, RowsPerPage, page, totalRows, params: new URLSearchParams(req.query).toString(), site: 'Titles', find, genres })
      })
    })
  })
}

module.exports = controller
