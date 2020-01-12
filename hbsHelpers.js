'use strict'

const hbs = require('express-hbs')

hbs.registerHelper('equal', (a, b) => { // usage {{ #if (equal a b) }}
  return a === b
})

hbs.registerHelper('pagination', (page, RowsPerPage, totalRows, params) => {
  let paginationLinks = ''
  const urlParams = new URLSearchParams(params)

  // previous page
  if (page > 0) {
    urlParams.set('page', page - 1)
    paginationLinks += `<a id='prev' href='?${urlParams.toString()}'> &#8249; </a>`
  } else {
    paginationLinks += '&nbsp;&nbsp;&nbsp;&nbsp;'
  }

  // current page
  paginationLinks += `<span>${page + 1}</span>`

  // next page
  if (page * RowsPerPage + RowsPerPage < totalRows) {
    urlParams.set('page', page + 1)
    paginationLinks += `<a id='next' href='?${urlParams.toString()}'> &#8250; </a>`
  } else {
    paginationLinks += '&nbsp;&nbsp;&nbsp;&nbsp;'
  }

  return new hbs.SafeString(paginationLinks)
})

hbs.registerHelper('lowercase', string => {
  return string.toLowerCase()
})

hbs.registerHelper('numResults', (page, RowsPerPage, totalRows) => {
  let results = ''

  const fromRows = page * RowsPerPage
  const toRows = Math.min(fromRows + RowsPerPage, totalRows)

  results = 'showing rows ' + fromRows + ' - ' + toRows + ' of ' + totalRows + ' total'

  return new hbs.SafeString(results)
})

hbs.registerHelper('orderByArrow', (col, params) => {
  if (!params) return

  const urlParams = new URLSearchParams(params)
  const orderBy = urlParams.get('orderBy') || ''

  if (orderBy.match(col)) {
    let returnString
    if (orderBy.match(new RegExp('desc', 'i'))) {
      returnString = '&darr;'
    } else {
      returnString = '&uarr;'
    }
    return new hbs.SafeString(returnString)
  }
})
