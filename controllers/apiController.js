const db = require('../db/mysql')

const controller = {}

controller.getGenres = (req, res) => {
  db.query('SELECT genreName FROM genres JOIN titlegenrerelations ON genreId = id WHERE titleId = "' + req.params.id + '" ', (err, result, fields) => {
    if (err) {
      console.log(err)
      return
    }
    res.send(result)
  })
}

module.exports = controller
