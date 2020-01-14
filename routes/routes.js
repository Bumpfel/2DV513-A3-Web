const router = require('express').Router()
const overviewController = require('../controllers/overviewController')
const apiController = require('../controllers/apiController')

router.get('/', overviewController.getOverview)
router.get('/api/genres/:id', apiController.getGenres)

module.exports = router
