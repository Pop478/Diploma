const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const trainerController = require('../controllers/trainerController')

router.use(authMiddleware)

router.get('/', trainerController.trainer)
router.get('/become', trainerController.becomeTrainer)
router.get('/my/:id', trainerController.myTrainer)

module.exports = router
