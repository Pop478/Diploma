const db = require('../db/index')
const logger = require('../logging/logging')

class athleteController {
    async getAthlete(req, res) {
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
}

module.exports = new athleteController()
