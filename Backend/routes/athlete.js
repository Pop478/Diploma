const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const athleteController = require('../controllers/athleteController')

router.use(authMiddleware)

router.get('/', athleteController.getGroup)

module.exports = router
