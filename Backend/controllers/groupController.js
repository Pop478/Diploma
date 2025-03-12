const db = require('../db/index')
const logger = require('../logging/logging')

class groupController {
    async getGroup(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const trainerStatus = await db.query(
                `SELECT t.*
            FROM trainers AS t
            WHERE t.user_id = $1;
            `,
                [user_id]
            )

            if (trainerStatus.rows.length === 0) {
                return res.status(204).json()
            }

            // Проверяем, является ли пользователь тренером и получаем его группы
            const trainerResult = await db.query(
                `SELECT u.*
                FROM users AS u
                JOIN groups g ON g.id = u.group_id
                JOIN trainers t ON t.id = g.trainer_id
                WHERE t.user_id = $1;
                `,
                [user_id]
            )

            if (trainerResult.rows.length === 0) {
                return res.status(404).json({
                    error: 'Группы не найдены или пользователь не является тренером',
                })
            }

            res.status(200).json(trainerResult.rows)
        } catch (err) {
            logger.error(
                `Ошибка при получении групп тренера (user_id: ${user_id}):`,
                err
            )
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async group(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            // Проверяем, является ли пользователь тренером
            const trainerResult = await db.query(
                'SELECT id FROM trainers WHERE user_id = $1',
                [user_id]
            )

            const trainer = trainerResult.rows[0]

            if (!trainer) {
                return res.status(400).json({
                    error: 'You are not a coach.',
                })
            }

            const trainer_id = trainer.id

            // Создаем новую группу
            const groupResult = await db.query(
                `INSERT INTO groups (trainer_id) VALUES ($1) RETURNING id`,
                [trainer_id]
            )

            const group_id = groupResult.rows[0].id

            res.status(201).json({
                success: true,
                message: 'Group created successfully!',
                group_id: group_id,
            })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async addUserToGroup(req, res) {
        try {
            const initData = res.locals.initData
            const user_id = initData.user.id
            const { sportsmen_id, group_id } = req.body

            // Проверяем, существует ли sportsmen_id
            const userExists = await db.query(
                `SELECT user_id, trainer_id FROM users WHERE user_id = $1`,
                [sportsmen_id]
            )

            if (userExists.rows.length === 0) {
                return res.status(404).json({
                    error: `User with ID ${sportsmen_id} does not exist.`,
                })
            }

            const sportsmen = userExists.rows[0]

            // Проверяем, что trainer_id пользователя совпадает с user_id тренера
            if (sportsmen.trainer_id !== user_id) {
                return res.status(403).json({
                    error: `You are not the trainer of user ${sportsmen_id}.`,
                })
            }

            await db.query(
                'UPDATE users SET group_id = $1 WHERE user_id = $2',
                [group_id, sportsmen_id]
            )

            res.status(201).json({
                success: true,
                message: `User ${sportsmen_id} add to ${group_id}.`,
            })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new groupController()
