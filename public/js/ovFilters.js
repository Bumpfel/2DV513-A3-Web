'use strict'

const loader = document.createElement('template')
loader.innerHTML = `
<div class='loader'>
</div>
`
// <i class="fa fa-spinner fa-spin" />

// <div class="box">
// Loading...
// </div>

const urlParams = new URLSearchParams(window.location.search)

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

// pagination listeners
document.querySelectorAll('.pagination').forEach(pagination => pagination.addEventListener('click', e => {
  if (e.target.nodeName === 'A') {
    displayLoader()
  }
}))

// column sorting
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

    urlParams.set('orderBy', newOrder + ' ' + sorting
    )

    displayLoader()
    window.location.href = '?' + urlParams.toString()
  }
})

// search
document.querySelector('#searchForm').addEventListener('submit', e => {
  e.preventDefault()

  const searchQuery = document.querySelector('input[type=search]').value

  urlParams.set('find', searchQuery)
  if (exactMatch.checked) {
    urlParams.set('exact', true)
  } else {
    urlParams.delete('exact')
  }

  displayLoader()
  window.location.href = '?' + urlParams.toString()
})

/* **** Filters ***** */
// adult
adultFilter.addEventListener('click', e => {
  if (adultFilter.checked) {
    urlParams.set('includeAdult', 'true')
  } else {
    urlParams.delete('includeAdult')
  }

  displayLoader()
  window.location.href = '?' + urlParams.toString()
})

// genres
genreFilter.addEventListener('change', e => {
  const selectedGenre = genreFilter.item(genreFilter.selectedIndex).id

  if (selectedGenre) {
    urlParams.set('genre', selectedGenre)
  } else {
    urlParams.delete('genre')
  }
  displayLoader()
  window.location.href = '?' + urlParams.toString()
})

const displayLoader = () => {
  document.body.classList.add('loader')
  document.body.appendChild(loader.content.cloneNode(true))
}
