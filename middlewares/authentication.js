const jwt  = require("jsonwebtoken")
const { User } = require("../models")
const { where } = require("sequelize")

async function authentication(req, res, next) {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1]
        if (!accessToken) {
            throw { status: 401, message: 'access denied'}
        }
        let decode = jwt.verify(accessToken, process.env.JWT_SECRET)
        
        const user = await User.findOne({
            where: {
                id: decode?.id
            }
        })

        if (!user) {
            throw { status: 401, message: 'access denied' }
        }

        req.user = decode
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = authentication