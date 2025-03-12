const db = require('../db')
const logger = require('../logging/logging')

class VolumeController {
    async getVolume(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        try {
            const result = await db.query(
                `SELECT v.volume, v.date 
                 FROM volume AS v
                 JOIN users u ON u.user_id = v.user_id
                 WHERE u.user_id = $1
                 AND v.date >= DATE_TRUNC('week', NOW())`,
                [user_id]
            )
            res.status(200).json(result.rows)
        } catch (err) {
            logger.error(err) // Ошибку логируем в catch
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getPlannedVolume(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        try {
            const result = await db.query(
                `SELECT pv.volume
                 FROM planned_volume AS pv
                 JOIN users u ON u.trainer_id = pv.trainer_id
                 WHERE u.user_id = $1 
                 AND pv.date >= DATE_TRUNC('week', NOW())`,
                [user_id]
            )
            res.status(200).json(result.rows)
        } catch (err) {
            logger.error(err) // Ошибку логируем в catch
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async addVolume(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { index } = req.body

        try {
            // Проверяем корректность индекса

            // Получаем текущую дату в формате YYYY-MM-DD
            const date = new Date().toISOString().split('T')[0]

            // Вставляем данные в таблицу
            const result = await db.query(
                `INSERT INTO volume (user_id, volume, date) VALUES ($1, $2, $3) RETURNING *`,
                [user_id, index, date]
            )

            res.status(201).json({
                message: 'Тест успешно добавлен',
            })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
    async addPlannedVolume(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { volume } = req.body // Получаем планируемый объем

        if (!volume || isNaN(volume)) {
            return res
                .status(400)
                .json({ error: 'Некорректное значение объема' })
        }

        try {
            // Получаем trainer_id из таблицы trainers
            const trainerResult = await db.query(
                `SELECT id FROM trainers WHERE user_id = $1`,
                [user_id]
            )

            if (trainerResult.rows.length === 0) {
                return res.status(404).json({ error: 'Тренер не найден' })
            }

            const trainer_id = trainerResult.rows[0].id

            // Проверяем, есть ли уже запись за текущую неделю
            const existingEntry = await db.query(
                `SELECT id FROM planned_volume 
                 WHERE trainer_id = $1 
                 AND date >= DATE_TRUNC('week', NOW())`,
                [trainer_id]
            )

            if (existingEntry.rows.length > 0) {
                return res
                    .status(409)
                    .json({ error: 'Запись на эту неделю уже существует' })
            }

            // Получаем текущую дату в формате YYYY-MM-DD
            const date = new Date().toISOString().split('T')[0]

            // Вставляем данные в таблицу planned_volume
            const result = await db.query(
                `INSERT INTO planned_volume (trainer_id, volume, date) VALUES ($1, $2, $3) RETURNING *`,
                [trainer_id, volume, date]
            )

            res.status(201).json({
                message: 'Планируемый объем успешно добавлен',
                data: result.rows[0],
            })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async getUserVolume(req, res) {
        const user_id = req.params.id
        try {
            // Запрос на получение запланированного объема
            const plannedResult = await db.query(
                `SELECT pv.volume AS planned_volume, pv.date
                 FROM users AS u
                 LEFT JOIN planned_volume pv ON pv.trainer_id = u.trainer_id
                 WHERE u.user_id = $1 `,
                [user_id]
            )

            // Запрос на получение фактического объема пользователя
            const actualResult = await db.query(
                `SELECT v.volume AS actual_volume, v.date 
                 FROM volume AS v
                 JOIN users u ON u.user_id = v.user_id
                 WHERE u.user_id = $1 `,
                [user_id]
            )

            res.status(200).json({
                planned_volume:
                    plannedResult.rows.length > 0 ? plannedResult.rows : null,
                actual_volume: actualResult.rows || 0,
            })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new VolumeController()
