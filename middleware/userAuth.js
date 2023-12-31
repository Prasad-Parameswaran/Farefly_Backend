const jwt = require('jsonwebtoken')


const checkJwt = (req, res, next) => {
    try {

        const tokenWithBearer = req.headers['authorization'];
        if (tokenWithBearer) {
            const tokenOnly = tokenWithBearer.split(' ')[1];
            const varifyJwt = jwt.verify(tokenOnly, 'secret')
            console.log(varifyJwt.id, 'token with bariar');
            req.id = varifyJwt.id
            console.log(req.id)
        }
        next()

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    checkJwt
}