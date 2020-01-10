const hbs = require('express-hbs')

hbs.registerHelper('equal', (a, b) => { // usage {{ #if (equal a b) }}
  return a === b
})

hbs.registerHelper('pagination', (page, RowsPerPage, totalRows, orderBy) => {
  let paginationLinks = ''

  // previous page
  if (page > 0) {
    paginationLinks += `<a href='?page=${page - 1}&orderBy=${orderBy}'> &lt; </a>`
  }

  // current page
  paginationLinks += `<span>${page + 1}</span>`

  // next page
  if (page * RowsPerPage + RowsPerPage < totalRows) {
    paginationLinks += `<a href='?page=${page + 1}&orderBy=${orderBy}'> &gt; </a>`
  }

  return new hbs.SafeString(paginationLinks)
})

hbs.registerHelper('numResults', (page, RowsPerPage, totalRows) => {
  let results = ''

  const fromRows = page * RowsPerPage
  const toRows = Math.min(fromRows + RowsPerPage, totalRows)

  results = 'showing rows ' + fromRows + ' - ' + toRows + ' of ' + totalRows + ' total'

  return new hbs.SafeString(results)
})

// hbs.registerHelper('pagination', (currentPage, totalRows, RowsPerPage) => {
//   if (totalRows < RowsPerPage) {
//     // contains only one page - skip page numbers
//     return
//   }
//   let paginationLinks

//   // previous pages
//   for (let page = 1; page < currentPage && totalRows > page * RowsPerPage; page++) {
//     paginationLinks += `<a href='/?page=${page}'>${page}</a>`
//   }

//   // current page
//   paginationLinks += `<span class='selectedPage'>${currentPage}</span>`

//   // next pages
//   for (let page = currentPage + 1; totalRows > (page - 1) * RowsPerPage; page++) {
//     paginationLinks += `<a href='/?page=${page}'>${page}</a>`
//   }

//   return new hbs.SafeString(paginationLinks)
// })
