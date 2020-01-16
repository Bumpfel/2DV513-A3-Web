'use strict'

const detailsTemplate = document.createElement('template')
detailsTemplate.innerHTML = `
Title details
<div class="box">

  <div class="side">
    <img src="">

    <p id="genre"></p>
  </div>

  <div class="main">
    <p id="title"></p>
    <div class="info">
      <div>
        <p> Year: <span id="year">N/A</span> </p>
        <p> Length: <span id="runtime">N/A</span> </p>
      </div>
      <div>
        <p> Rating: <span id="rating">N/A</span> </p>
        <p> Votes: <span id="votes">N/A</span> </p>
      </div>
    </div>
  </div>

</div>
`

const titleDetails = document.querySelector('#titleDetails')
const dataTable = document.querySelector('table#data tbody')

let activeRow

if (dataTable) {
  dataTable.addEventListener('click', async e => {
    if (e.target.nodeName === 'TD') {
      if (e.target.parentNode !== activeRow) {
        clearContent()
        activeRow = e.target.parentNode
        setActiveTitleRow()
        setContent()
      } else {
        clearContent(true)
      }
    }
  })
}

const clearContent = resetClickedRow => {
  if (activeRow) {
    activeRow.classList.remove('emphasized')
  }
  if (resetClickedRow) {
    activeRow = undefined
  }
  while (titleDetails.lastChild) {
    titleDetails.lastChild.remove()
  }
}

const setActiveTitleRow = () => {
  activeRow.classList.add('emphasized')
}

const setContent = async () => {
  titleDetails.appendChild(detailsTemplate.content.cloneNode(true))

  // set text content
  insertScrapeData('title', true)
  insertScrapeData('year')
  insertScrapeData('runtime')
  insertScrapeData('rating')
  insertScrapeData('votes')

  // insert imdb link
  const id = activeRow.querySelector('#id').textContent.trim()
  const imdbLink = document.createElement('a')
  imdbLink.href = 'https://www.imdb.com/title/' + id
  imdbLink.innerText = 'view on imdb'
  imdbLink.target = '_new'
  titleDetails.querySelector('.main').appendChild(imdbLink)

  // set icon (local)
  const titleType = activeRow.querySelector('#type').innerText
  const img = titleDetails.querySelector('img')
  if (titleType.startsWith('tv')) {
    img.src = '/icons/tv.png'
  } else {
    img.src = '/icons/' + titleType + '.png'
  }
  img.title = titleType
  titleDetails.querySelector('.side').insertBefore(document.createTextNode(titleType), img.nextElementSibling)

  // get genre async and change content
  const genresResponse = await window.fetch('/api/genres/' + activeRow.id)
  const genres = await genresResponse.json()
  let genresString = ''
  genres.forEach(genre => { genresString += ', ' + genre.genreName })
  document.querySelector('#genre').innerText = genresString.substring(2)
}

const insertScrapeData = (field, isString) => {
  const fieldData = activeRow.querySelector('#' + field).textContent.trim()
  if (fieldData && (isString || fieldData > 0)) {
    titleDetails.querySelector('#' + field).innerText = fieldData
  }
}
