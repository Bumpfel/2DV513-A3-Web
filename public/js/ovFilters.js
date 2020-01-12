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

// set state of filters
const adultFilter = document.querySelector('#adultFilter')
if (urlParams.get('includeAdult')) {
  adultFilter.checked = true
}

const genreFilter = document.querySelector('#genreFilter')
const selectedGenre = urlParams.get('genre')
if (selectedGenre) {
  genreFilter.value = selectedGenre
  if (selectedGenre === 'Adult') {
    adultFilter.remove()
    document.querySelector('label[for="adultFilter"').remove()
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
    const prevOrder = urlParams.get('orderBy') || ''

    let sortOrder = prevOrder.split(' ')[1]
    if (sortOrder === 'DESC') {
      sortOrder = 'ASC'
    } else if (sortOrder === 'ASC') {
      sortOrder = 'DESC'
    } else {
      sortOrder = newOrder === 'primaryTitle' ? 'ASC' : 'DESC'
    }

    urlParams.set('orderBy', newOrder + ' ' + sortOrder
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
  const selectedGenre = genreFilter.value // genreFilter.item(genreFilter.selectedIndex).id

  if (selectedGenre) {
    urlParams.set('genre', selectedGenre)
  } else {
    urlParams.delete('genre')
  }
  displayLoader()
  window.location.href = '?' + urlParams.toString()
})

const displayLoader = () => {
  document.body.appendChild(loader.content.cloneNode(true))
}
