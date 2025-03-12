const db = require('../db')
const logger = require('../logging/logging')

class UserController {
    async user(req, res) {
        const user_id = req.params.id
        try {
            const result = await db.query(
                `SELECT * FROM users WHERE user_id = $1`,
                [user_id]
            )
            res.status(200).json(result.rows[0])
        } catch (err) {
            logger.error(err) // Ошибку логируем в catch
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async me(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        try {
            const result = await db.query(
                `SELECT u.*, 
                        CASE 
                            WHEN t.id IS NOT NULL THEN true 
                            ELSE false 
                        END AS trainer
                 FROM users AS u
                 LEFT JOIN trainers AS t ON u.user_id = t.user_id
                 WHERE u.user_id = $1`,
                [user_id]
            )

            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0])
            } else {
                res.status(404).json({ error: 'User not found' })
            }
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async patchUser(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id
        const { first_name, last_name, rank, birth_date } = req.body

        try {
            let baseQuery = `UPDATE users SET`
            const updates = []
            const params = []

            if (first_name) {
                updates.push(`first_name = $${params.length + 1}`)
                params.push(first_name)
            }
            if (last_name) {
                updates.push(`last_name = $${params.length + 1}`)
                params.push(last_name)
            }
            if (rank) {
                updates.push(`rank = $${params.length + 1}`)
                params.push(rank)
            }
            if (birth_date) {
                updates.push(`birth_date = $${params.length + 1}`)
                params.push(birth_date)
            }

            if (updates.length === 0) {
                return res.status(400).json({ error: 'No fields to update' })
            }

            // Завершаем запрос
            baseQuery += ` ${updates.join(', ')} WHERE user_id = $${
                params.length + 1
            }`
            params.push(user_id)

            // Выполнение запроса
            await db.query(baseQuery, params)

            res.status(200).json({ success: true })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new UserController()
