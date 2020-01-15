'use strict'

const db = require('../db/mysql')

const controller = {}
const RowsPerPage = 25

// record title types, to replace them later (faster than selecting from multiple tables. at least with the query I came up with)
const displayFields = ['titles.id', 'primaryTitle AS Title', /* 'genreName AS Genre', *//* 'typeName AS Type', */ 'titleTypeId AS Type', 'startYear AS Year', 'runtimeMinutes AS Runtime', 'averageRating AS Rating', 'numVotes AS Votes']
const types = new Map()

db.query('SELECT * FROM titletypes', (err, result, fields) => {
  if (err || !result.length) {
    console.log(err)
    return
  }
  for (let i = 0; i < result.length; i++) {
    types.set(result[i].id, result[i].typeName)
  }
})

// record genre names
const genres = []
db.query('SELECT genreName FROM genres', (err, result, fields) => {
  if (err || !result.length) {
    console.error('COUNT_ERROR: ', err.message)
    return
  }
  result.forEach(row => {
    genres.push(row)
  })
})

controller.getOverview = (req, res) => {
  const regex = new RegExp('\'', 'g')
  if (req.query.orderBy) {
    var orderBy = db.escape(req.query.orderBy).replace(regex, '')
  } else {
    orderBy = 'titles.id'
  }

  const filters = getFilterString(req.query)

  let mainQuery = ''
  if (req.query.titleType) {
    // mainQuery = 'JOIN titletypes ON titleTypeId = titletypes.id '
  }
  if (req.query.genre) {
    mainQuery += 'JOIN titlegenrerelations ON titles.id = titleId JOIN genres ON genres.id = titlegenrerelations.genreId WHERE genreName = ' + db.escape(req.query.genre) + filters
  } else {
    mainQuery += 'WHERE 1' + filters
  }

  // count total rows
  const sqlQueryCount = 'SELECT COUNT(titles.id) AS totalRows FROM titles ' + mainQuery

  db.query(sqlQueryCount, (err, result, fields) => {
    // console.log('counted')
    if (err) {
      console.error('COUNT_ERR: ', err.message)
      console.log(sqlQueryCount)
    }
    if (!result) {
      console.log('No result')
      return
    }

    const totalRows = result[0].totalRows

    // verify that page exist
    let page = req.query.page || 0
    page = parseInt(page)
    page = req.query.page && totalRows > 0 ? Math.min(page, Math.floor((totalRows - 1) / RowsPerPage)) : 0 // set to last page of result if page parameter is > last page

    // main query
    const sqlQueryGet = 'SELECT ' + displayFields + ' FROM titles ' + mainQuery + ' ORDER BY ' + orderBy + ', numVotes DESC LIMIT ' + RowsPerPage * page + ',' + RowsPerPage // JOIN titletypes ON titleTypeId = titletypes.id
    db.query(sqlQueryGet, (err, result, fields) => {
      console.log(sqlQueryGet)
      if (err) {
        console.error('QUERY_ERR: ', err.message)
        console.log(sqlQueryGet)
      }

      if (result) {
        result.forEach(row => {
          row.Type = types.get(row.Type)
        })
      }

      res.render('overview', { result, fields, RowsPerPage, page, totalRows, params: new URLSearchParams(req.query).toString(), site: 'Titles', find: req.query.find, genres, types: types.values() })
    })
  })
}

const getFilterString = query => {
  const filterArr = []
  const find = query.find

  // adult filter
  if (query.excludeAdult && !query.genre) {
    filterArr.push('!isAdult')
  }

  // search filter
  if (query.find) {
    if (query.exact) {
      filterArr.push('primaryTitle = ' + db.escape(find))
    } else {
      filterArr.push('primaryTitle LIKE ' + db.escape('%' + find + '%'))
    }
  }

  // type filter
  if (query.titleType) {
    let titleTypeId
    for (const type of types.keys()) {
      if (types.get(type) === query.titleType) {
        titleTypeId = type
      }
    }

    filterArr.push('titleTypeId = ' + db.escape(titleTypeId)) // types.get(query.titleType)
  }

  // build string
  let filters = ''
  filterArr.forEach(filter => { filters += ' AND ' + filter })

  return filters
}

module.exports = controller
