'use strict'

// const loader = document.createElement('template')
// loader.innerHTML = `
// <div class='loader'>
// <i class="fa fa-spinner fa-spin" />
// </div>
// `

// <div class="box">
// Loading...
// </div>

let urlParams = new URLSearchParams(window.location.search)
const search = document.querySelector('input[type=search]')

// set state of filter settings
const exactMatch = document.querySelector('#exact')
if (urlParams.get('exact')) {
  exactMatch.checked = true
}

const adultFilter = document.querySelector('#adultFilter')
if (urlParams.get('includeAdult')) {
  adultFilter.checked = true
}

const genreFilter = document.querySelector('#genreFilter')
const selectedGenre = urlParams.get('genre')
if (selectedGenre) {
  genreFilter.value = selectedGenre
  if (selectedGenre) {
    document.querySelector('#adultBox').remove()
  }
}

const typeFilter = document.querySelector('#typeFilter')
const selectedType = urlParams.get('titleType')
if (selectedType) {
  typeFilter.value = selectedType
  // typeFilter.value = typeFilter.querySelector('#' + selectedType).value
}

// pagination listeners
document.querySelectorAll('.pagination').forEach(pagination => pagination.addEventListener('click', e => {
  if (e.target.nodeName === 'A') {
    displayLoader()
  }
}))

// column sorting
const columnHeaders = document.querySelector('#columnHeaders')
if (columnHeaders) {
  document.querySelector('#columnHeaders').addEventListener('click', e => {
    e.preventDefault()

    if (e.target.nodeName === 'A') {
      const newOrder = e.target.id
      const tempOrder = urlParams.get('orderBy')

      if (tempOrder) {
        var prevOrder = tempOrder.split(' ')[0]
        var prevSorting = tempOrder.split(' ')[1]
      }
      let sorting
      // flip sorting
      if (newOrder === prevOrder) { // previous order was this column
        if (prevSorting === 'DESC') {
          sorting = 'ASC'
        } else if (prevSorting === 'ASC') {
          sorting = 'DESC'
        }
      } else { // set default sorting
        sorting = newOrder === 'Title' ? 'ASC' : 'DESC'
      }

      urlParams.set('orderBy', newOrder + ' ' + sorting) //  prevOrder + ' ' + prevSorting + ', ' +

      go()
    }
  })
}

// search
document.querySelector('#searchForm').addEventListener('submit', e => {
  e.preventDefault()

  if (!search.value && !urlParams.get('find')) return
  urlParams.set('find', search.value)

  go()
})

/* **** Filters ***** */
// reset filters
document.querySelector('#filterReset').addEventListener('click', e => {
  e.preventDefault()

  const find = urlParams.get('find')
  urlParams = new URLSearchParams()
  urlParams.set('find', find)

  go()
})

// adult
adultFilter.addEventListener('click', e => {
  if (adultFilter.checked) {
    urlParams.set('includeAdult', 'true')
  } else {
    urlParams.delete('includeAdult')
  }

  go()
})

// genres
genreFilter.addEventListener('change', e => {
  const selectedGenre = genreFilter.item(genreFilter.selectedIndex).id

  if (selectedGenre) {
    urlParams.set('genre', selectedGenre)
  } else {
    urlParams.delete('genre')
  }

  go(e)
})

// types
typeFilter.addEventListener('change', e => {
  const selectedType = typeFilter.item(typeFilter.selectedIndex).id

  if (selectedType) {
    urlParams.set('titleType', selectedType)
  } else {
    urlParams.delete('titleType')
  }

  go()
})

/*************/

// go
const go = () => {
  if (search.value === '') {
    urlParams.delete('find')
  }
  if (exactMatch.checked) {
    urlParams.set('exact', true)
  } else {
    urlParams.delete('exact')
  }

  displayLoader()
  window.location.href = '?' + urlParams.toString()
}

// functions
const displayLoader = () => {
  document.querySelector('fieldset').disabled = true
  document.body.classList.add('loader')
  // document.body.appendChild(loader.content.cloneNode(true))
}
