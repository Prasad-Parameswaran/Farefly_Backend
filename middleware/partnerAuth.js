const jwt = require('jsonwebtoken')


const checkJwt = (req, res, next) => {
    try {
        const tokenWithBearer = req.headers['authorization'];
        if (tokenWithBearer) {
            const tokenOnly = tokenWithBearer.split(' ')[1];
            const varifyJwt = jwt.verify(tokenOnly, 'partner')
            req.id = varifyJwt.id
        }
        next()


    } catch (error) {
        alert('something went wrong')
    }
}

module.exports = {
    checkJwt
}