const jwt = require('jsonwebtoken')


const checkJwt = (req, res, next) => {
    try {
        const tokenWithBearer = req.headers['authorization'];
        if (tokenWithBearer) {
            const tokenOnly = tokenWithBearer.split(' ')[1];
            console.log(tokenOnly, "jjjj");
            const varifyJwt = jwt.verify(tokenOnly, 'secret')
            console.log(varifyJwt, "hhhhhhhhhhhhhhhhhhh");
            req.id = varifyJwt.id
        }
        next()

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    checkJwt
}