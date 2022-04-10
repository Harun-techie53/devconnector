const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//@route    GET /api/users
//@desc     Register User
//@access   Public
router.post("/", [
    check("name", "Name is required")
        .not()
        .isEmpty(),
    check("email", "Please include a valid email")
        .isEmail(),
    check("password", "Password should be 8 or more characters")
        .isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body;

    try {
        //check whether the user is already exist or not
        let user = await User.findOne({ email });
    
        if(user) {
            res.status(400).json({ msg: "User is already exist" });
        }
    
        //grap the avatar of the user from  email
        const avatar = gravatar.url(email, {
            s: "200",
            r: "pg",
            d: "mm"
        });
    
        //create an instance of the user
        user = new User({
            name, 
            email,
            password,
            avatar
        });
    
        //encrypt the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    
        //save the user
        await user.save();

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

                res.status(200).json({ token });
            }
        );
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;