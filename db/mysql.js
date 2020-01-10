const mysql = require('mysql')

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'imdb_data'
  // database: '2dv513a3'
})

let reconnectInterval

con.on('connect', () => {
  console.log('Connected to mysql server')
  clearInterval(reconnectInterval)
})

con.on('error', () => console.log('Error connecting to mysql server!'))
con.on('end', () => console.log('Connection to mysql server closed'))

module.exports = con
// module.exports.q = async queryString => {
//   con.query(queryString, (err, result, fields) => {
//     if (err) {
//       throw Error(err.message)
//     }
//     return result
//   })
// }
