const router = require('express').Router()
const overviewController = require('../controllers/overviewController')

router.get('/names', overviewController.getNamesOverview)
router.get('/titles', overviewController.getTitlesOverview)

module.exports = router
