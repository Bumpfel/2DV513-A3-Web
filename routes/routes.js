const router = require('express').Router()
const overviewController = require('../controllers/overviewController')
const homeController = require('../controllers/homeController')

router.get('/', homeController.getHomePage)

router.get('/names', overviewController.getNamesOverview)
router.get('/titles', overviewController.getTitlesOverview)

module.exports = router
