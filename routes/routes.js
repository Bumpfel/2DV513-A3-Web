const router = require('express').Router()
const overviewController = require('../controllers/overviewController')
const apiController = require('../controllers/apiController')

try {
  router.get('/', overviewController.getOverview)
} catch (err) {
  console.log('-----FEEEEEEEEEEL')
}

router.get('/api/genres/:id', apiController.getGenres)

module.exports = router
