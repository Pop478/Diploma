const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const testsController = require('../controllers/testsController')

router.use(authMiddleware)

router.get('/ortho', testsController.orthoTest)
router.post('/ortho', testsController.addOrthoTest)
router.get('/ortho/:id', testsController.userOrthoTest)

module.exports = router
