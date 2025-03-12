const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const groupController = require('../controllers/groupController')

router.use(authMiddleware)

router.get('/', groupController.getGroup)
router.get('/create', groupController.group)
router.post('/', groupController.addUserToGroup)

module.exports = router
