const loader = document.createElement('template')
loader.innerHTML = `
  <div class='loader'>
    Loading...
  </div>
`

document.querySelector('#isAdult').addEventListener('click', e => {
  const params = window.location.search || '?'
  const test = new URLSearchParams(window.location.search)

  window.location.href = params + '&filter=isAdult'
})

document.querySelector('#searchForm').addEventListener('submit', e => {
  e.preventDefault()

  const searchQuery = document.querySelector('input[type=search]').value

  document.body.appendChild(loader.content.cloneNode(true))

  const params = window.location.search || '?'
  // const test = new URLSearchParams(window.location.search)
  window.location.href = params + '&find=' + searchQuery
})
