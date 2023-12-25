const jwt = require('jsonwebtoken')


const checkJwt = (req, res, next) => {
    try {
        const tokenWithBearer = req.headers['authorization'];
        if (tokenWithBearer) {
            const tokenOnly = tokenWithBearer.split(' ')[1];

            const varifyJwt = jwt.verify(tokenOnly, 'partner')
            console.log('this is partners jwt token authentication ');
            req.id = varifyJwt.id

        }
        next()


    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    checkJwt
}