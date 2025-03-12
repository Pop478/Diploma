const db = require('../db')
const logger = require('../logging/logging')

class TestsController {
    async orthoTest(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        try {
            const result = await db.query(
                `SELECT * FROM orthotest WHERE user_id = $1`,
                [user_id]
            )
            res.status(200).json(result.rows)
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async addOrthoTest(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { index } = req.body

        try {
            // Проверяем корректность индекса
            if (!index || isNaN(index) || index < -5 || index > 14) {
                return res.status(400).json({
                    error: 'Неверный индекс. Он должен быть от 1 до 14.',
                })
            }

            // Получаем текущую дату в формате YYYY-MM-DD
            const date = new Date().toISOString().split('T')[0]

            // Проверяем, есть ли уже запись на сегодня
            const resultToday = await db.query(
                `SELECT * FROM orthotest WHERE user_id = $1 AND date = $2`,
                [user_id, date]
            )

            if (resultToday.rows.length > 0) {
                // Проверяем длину массива, а не его наличие
                return res.status(409).json({
                    error: 'На сегодня уже есть запись',
                })
            }

            // Вставляем данные в таблицу
            const result = await db.query(
                `INSERT INTO orthotest (user_id, result, date) VALUES ($1, $2, $3) RETURNING *`,
                [user_id, index, date]
            )

            return res.status(201).json({
                message: 'Тест успешно добавлен',
                data: result.rows[0], // Возвращаем данные
            })
        } catch (err) {
            logger.error(err)
            return res.status(500).json({ error: 'Internal server error' })
        }
    }

    async userOrthoTest(req, res) {
        const initData = res.locals.initData
        const athlete_id = req.params.id

        if (!athlete_id) {
            return res.status(400).json({ error: 'ID спортсмена не указан' })
        }
        try {
            const result = await db.query(
                `SELECT * FROM orthotest
                WHERE user_id = $1`,
                [athlete_id]
            )
            res.status(200).json(result.rows)
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new TestsController()
