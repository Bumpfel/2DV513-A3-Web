'use strict'

const express = require('express')
const db = require('./db/mysql.js')
const path = require('path')
const hbs = require('express-hbs')
require('./hbsHelpers')

const app = express()
const port = 5000

app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, '/views/layouts/default')
}))
app.set('view engine', 'hbs')

app.use(express.static(path.join(__dirname, 'public')))

db.connect(err => {
  if (err) {
    console.error(err.message)
    process.exit(-1)
  }
})

app.use('/', require('./routes/routes'))

// 404 page not found
app.use((req, res, next) => {
  res.sendStatus(404)
})

// 500 internal server error
app.use((err, req, res, next) => {
  console.log(err)
  res.sendStatus(500)
})

app.listen(port, () => console.log('Server listening on port ' + port))
