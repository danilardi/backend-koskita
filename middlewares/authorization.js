function authorization(req, res, next) {
    let role = req.user.role
    console.log(role)
    if (role !== 'admin') {
        throw { status: 401, message: 'unauthorized' }
    }
    next()
}

module.exports = authorization