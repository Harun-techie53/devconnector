const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
    const token = req.header("x-auth-token");

    if(!token) {
        res.status(401).json({ msg: "No token, Authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"));

        req.user = decoded.user;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ msg: "Token is not valid" });
    }
}