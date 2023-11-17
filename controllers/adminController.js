


const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email === process.env.adminEmail && process.env.adminPassword === password) {
            res.status(200).json({ success: true })
        } else {
            res.status(201).json({ success: false, message: 'invalid password or email..' })
        }
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'something went wrong....' })
    }

}


module.exports = {
    login
}