function authorization(req, res, next) {
    let role = req.user.role
    if (role !== 'admin') {
        throw { status: 401, message: 'unauthorized' }
    }
    next()
}

module.exports = authorization