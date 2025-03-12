const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

router.get('/me', userController.me)
router.get('/:id', userController.user)

router.patch('/', userController.patchUser)

module.exports = router
