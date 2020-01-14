'use strict'

const detailsTemplate = document.createElement('template')
detailsTemplate.innerHTML = `
  <div class="pappaDiv">
    <!-- Top -->
    <div class="topDiv">
      <h1 id="title"></h1>
    </div>

    <div class="botDiv">
      <h2 id="genre"></h2>
    </div>

    <!-- Middle -->
    <div class="middleDiv">
      <img src="Icons/talk-show.png">

      <div class="infoDiv">
        <div class="numberHolder">         
          <div class="numbers">
            <p> Year: <span id="year">unknown</span> </p>
            <p> Length: <span id="runtime">unknown</span> </p>
          </div>
          
          <div class="numbers">
            <p> Rating: <span id="rating">not rated</span> </p>
            <p> Votes: <span id="votes">unknown</span> </p>
          </div>
        </div>
      </div>
    </div>
`

const titleDetails = document.querySelector('#titleDetails')
const dataTable = document.querySelector('table#data tbody')

if (dataTable) {
  dataTable.addEventListener('click', async e => {
    if (e.target.nodeName === 'TD') {
      while (titleDetails.lastChild) {
        titleDetails.lastChild.remove()
      }
      const clickedRow = e.target.parentNode
      titleDetails.appendChild(detailsTemplate.content.cloneNode(true))
      titleDetails.querySelector('#title').innerText = clickedRow.querySelector('#Title').textContent.trim()
      titleDetails.querySelector('#year').innerText = clickedRow.querySelector('#Year').textContent.trim()
      titleDetails.querySelector('#runtime').innerText = clickedRow.querySelector('#Runtime').textContent.trim() + ' min'
      titleDetails.querySelector('#rating').innerText = clickedRow.querySelector('#Rating').textContent.trim()
      titleDetails.querySelector('#votes').innerText = clickedRow.querySelector('#Votes').textContent.trim()
      // titleDetails.querySelector('img').src = 'Icons/'
      // const result = await window.fetch('https://www.imdb.com/title/tt0120338')
      // console.log('fetched')
      // const imgUrl = result.querySelector('.poster a').href

      const genresResponse = await window.fetch('/api/genres/' + clickedRow.id)
      const genres = await genresResponse.json()
      let genresString = ''
      genres.forEach(genre => { genresString += ', ' + genre.genreName })
      document.querySelector('#genre').innerText = genresString.substring(2)
    }
  })
}
