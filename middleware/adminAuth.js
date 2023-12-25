const jwt = require('jsonwebtoken')


const checkJwt = (req, res, next) => {
    try {
        const tokenWithBearer = req.headers['authorization'];
        if (tokenWithBearer) {
            const tokenOnly = tokenWithBearer.split(' ')[1];
            console.log(tokenOnly, "jjjj");
            const varifyJwt = jwt.verify(tokenOnly, 'admin')
            req.id = varifyJwt.id
            console.log(req.id, "this is admin id ");
            next()
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    checkJwt
}