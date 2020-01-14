const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'imdb_data'
})

const q = query => {
  con.query(query, (err, result, fields) => {
    if (err) {
      console.log(err)
      return
    }
    return (result, fields)
  })
}

let reconnectInterval

con.on('connect', () => {
  console.log('Connected to mysql server')
  clearInterval(reconnectInterval)
})

con.on('error', err => console.log(err))
con.on('end', msg => console.log(msg))

module.exports = con
