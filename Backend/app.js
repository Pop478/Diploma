const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./logging/logging')
const initAuth = require('./routes/auth')
const userRouter = require('./routes/user')
const trainerRouter = require('./routes/trainer')
const groupRouter = require('./routes/group')
const testsRouter = require('./routes/tests')
const volumeRouter = require('./routes/volume')

app.use(cors())
const path = require('path')

app.use(express.json())
//Полчение картинки из папки Bot папки static
app.use(express.static(path.join(__dirname, '../Bot/static')))

app.use('/auth', initAuth)
app.use('/user', userRouter)
app.use('/trainer', trainerRouter)
app.use('/group', groupRouter)
app.use('/tests', testsRouter)
app.use('/volume', volumeRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`)
})
