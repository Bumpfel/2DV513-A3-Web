'use strict'

const detailsTemplate = document.createElement('template')
detailsTemplate.innerHTML = `
  <div class="pappaDiv">
    <!-- Top -->
    <div class="topDiv">
      <h1>Star wars: De phäntom menace</h1>
    </div>

    <div class="botDiv">
      <h2>Genre</h2>
    </div>

    <!-- Middle -->
    <div class="middleDiv">
      <img src="Icons/talk-show.png">

      <div class="infoDiv">
        <div class="numberHolder">         
          <div class="numbers">
            <p> Year: <span id="year">2020</span> </p>
            <p> Length: <span id="runtime">240</span> min </p>
          </div>
          
          <div class="numbers">
            <p> Rating: <span id="rating">7.4</span> </p>
            <p> Votes: <span id="votes">8</span> </p>
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
      titleDetails.querySelector('h1').innerText = clickedRow.querySelector('#Title').textContent.trim()
      titleDetails.querySelector('#year').innerText = clickedRow.querySelector('#Year').textContent.trim()
      titleDetails.querySelector('#runtime').innerText = clickedRow.querySelector('#Runtime').textContent.trim()
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
      document.querySelector('h2').innerText = genresString.substring(2)
    }
  })
}
