const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

router.get(
    "/", 
    auth, 
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");
    
            if(!user) {
                res.status(400).json({ msg: "User not found" })
            }
            res.send(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    });

router.post(
    "/",
    async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });

            if(!user) {
                res.status(400).json({ msg: "Invalid Credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if(!isMatch) {
                res.status(400).json({ msg: "Invalid Credentials" });
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                    expiresIn: 360000
                },
                (err, token) => {
                    if(err) throw err;

                    res.status(200).send(token);
                }
            )
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)

module.exports = router;