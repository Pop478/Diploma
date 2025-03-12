const express = require('express')
const volumeController = require('../controllers/volumeController')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/', volumeController.getVolume)
router.post('/', volumeController.addVolume)
router.get('/planned', volumeController.getPlannedVolume)
router.get('/planned/:id', volumeController.getUserVolume)
router.post('/planned', volumeController.addPlannedVolume)

module.exports = router
