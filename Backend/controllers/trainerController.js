const db = require('../db/index')
const logger = require('../logging/logging')

class TrainerController {
    async trainer(req, res) {
        try {
            const result = await db.query(
                `SELECT u.first_name, u.last_name, t.id 
                FROM trainers AS t
                JOIN users u ON u.user_id = t.user_id`
            )
            res.status(200).json(result.rows)
            console.log(result.rows)
        } catch (err) {}
    }

    async becomeTrainer(req, res) {
        const initData = res.locals.initData
        const user_id = initData.user.id

        try {
            const userInfoResult = await db.query(
                `SELECT first_name, last_name FROM users WHERE user_id = $1`,
                [user_id]
            )

            const userInfo = userInfoResult.rows[0]

            if (!userInfo || !userInfo.first_name || !userInfo.last_name) {
                return res.status(400).json({
                    error: 'First name and last name must be set before becoming a trainer.',
                })
            }

            const userCheckTrainer = await db.query(
                `SELECT EXISTS(SELECT * FROM trainers WHERE user_id = $1 LIMIT 1) AS is_trainer`,
                [user_id]
            )

            const userTrainerInfo = userCheckTrainer.rows[0]

            if (userTrainerInfo.is_trainer) {
                return res.status(400).json({
                    error: 'You are already a coach.',
                })
            }

            await db.query(`INSERT INTO trainers (user_id) VAlUES ($1)`, [
                user_id,
            ])
            res.status(200).json({
                success: true,
                message: 'You are now a trainer!',
            })
        } catch (err) {
            logger.error(err)
            res.status(500).json({ error: 'Internal server error' })
        }
    }

    async myTrainer(req, res) {
        const trainer_id = req.params.id
        try {
            const result = await db.query(
                `SELECT u.last_name, u.first_name FROM users AS u
                JOIN trainers t ON t.user_id = u.user_id 
                WHERE t.id = $1
                `,
                [trainer_id]
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
}

module.exports = new TrainerController()
