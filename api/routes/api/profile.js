const request = require("request");
const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const config = require("config");


//@route    GET /api/profile/me
//@desc     get user personal profile
//@access   Private
router.get(
    "/me", 
    auth, 
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            if(!profile) {
                res.status(400).json({
                    msg: "Profile not found"
                })
            }

            res.status(200).send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);

//@route    GET /api/profile/:userId
//@desc     get user personal profile
//@access   Public
router.get(
    "/:profileId",
    async (req, res) => {
        try {
            const profile = await Profile.findById(req.params.profileId);

            if(!profile) {
                res.status(400).json({
                    msg: "Profile not found"
                });
            }

            res.status(200).send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("server error");
        }
    }
)

//@route    POST /api/profile
//@desc     create user profile
//@access   Private
router.post(
    "/",
    auth,
    [
        check("status", "Status is required")
            .not()
            .isEmpty(),
        check("skills", "Skills is required")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const error = validationResult(req);

        if(!error.isEmpty()) {
            res.status(400).json({ errors: error.array() });
        }

        const {
            company,
            website,
            location,
            status,
            skills,
            bio,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedIn,
            instagram
        } = req.body;

        let profileFields = {};

        profileFields.user = req.user.id;
        if(company) profileFields.company = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(status) profileFields.status = status;
        if(bio) profileFields.bio = bio;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.split(",").map(skill => skill.trim());
        }
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(facebook) profileFields.social.facebook = facebook;
        if(twitter) profileFields.social.twitter = twitter;
        if(instagram) profileFields.social.instagram = instagram;
        if(linkedIn) profileFields.social.linkedIn = linkedIn;
        try {
            let profile = await Profile.findOne({ user: req.user.id });

            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json({ profile });
            }

            profile = new Profile(profileFields);

            await profile.save();

            res.status(200).send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)


//@route    POST /api/profile/education
//@desc     create profile education
//@access   Private
router.post(
    "/education",
    auth,
    [
        check("school", "School is required")
            .not()
            .isEmpty(),
        check("degree", "Degree is required")
            .not()
            .isEmpty(),
        check("fieldOfStudy", "Subject is required")
            .not()
            .isEmpty(),
        check("from", "From date is required")
            .not()
            .isEmpty(),
        check("current", "Current status is required")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            school,
            degree,
            fieldOfStudy,
            from,
            to,
            current,
            description
        } = req.body;

        let educationFields = {};

        if(school) educationFields.school = school;
        if(degree) educationFields.degree = degree;
        if(fieldOfStudy) educationFields.fieldOfStudy = fieldOfStudy;
        if(from) educationFields.from = from;
        if(to) educationFields.to = to;
        if(current) educationFields.current = current;
        if(description) educationFields.description = description;
        try {
            let profile = await Profile.findOne({ user: req.user.id });

            profile.education.unshift(educationFields);

            await profile.save();

            res.status(200).send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)


//@route    POST /api/profile/experience
//@desc     create profile education
//@access   Private
router.post(
    "/experience",
    auth,
    [
        check("title", "Title is required")
            .not()
            .isEmpty(),
        check("company", "Company is required")
            .not()
            .isEmpty(),
        check("from", "From date is required")
            .not()
            .isEmpty(),
        check("current", "Current status is required")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({
                errors: errors.array()
            })
        }

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        let expFields = {};

        if(title) expFields.title = title;
        if(company) expFields.company = company;
        if(location) expFields.location = location;
        if(from) expFields.from = from;
        if(to) expFields.to = to;
        if(current) expFields.current = current;
        if(description) expFields.description = description;
        try {
            let profile = await Profile.findOne({ user: req.user.id });

            profile.experience.unshift(expFields);

            await profile.save();

            res.status(200).send(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    DELETE /api/profile
//@desc     delete user profile
//@access   Private
router.delete(
    "/",
    auth,
    async (req, res) => {
        try {
            //Profile Delete
            await Profile.findOneAndRemove({ user: req.user.id });

            //User Delete
            await User.findOneAndRemove({ user: req.user.id });

            res.status(200).send("User Deleted");
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    DELETE /api/profile/experience/:expId
//@desc     delete user profile experience by ID
//@access   Private
router.delete(
    "/experience/:expId",
    auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            const removeIndex = profile.experience.map(
                (item) => item.id
            ).indexOf(req.params.expId);

            profile.experience.splice(removeIndex, 1);

            await profile.save();

            res.status(200).send("Profile Experience Deleted");
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    DELETE /api/profile
//@desc     delete user profile
//@access   Private
router.delete(
    "/",
    auth,
    async (req, res) => {
        try {
            //Profile Delete
            await Profile.findOneAndRemove({ user: req.user.id });

            //User Delete
            await User.findOneAndRemove({ user: req.user.id });

            res.status(200).send("User Deleted");
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    DELETE /api/profile/education/:eduId
//@desc     delete user profile education by ID
//@access   Private
router.delete(
    "/education/:eduId",
    auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id });

            const removeIndex = profile.education.map(
                (item) => item.id
            ).indexOf(req.params.eduId);

            profile.education.splice(removeIndex, 1);

            await profile.save();

            res.status(200).send("Profile Education Deleted");
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    GET /api/profile/github/:username
//@desc     get user github profile
//@access   Public
router.get(
    "/github/:username",
    (req, res) => {
        try {
            const options = {
                uri: `https://api.github.com/users/${req.params.username}
                /repos?per_page=5&sort=created:asc&client_id=${config.get("githubClientId")}
                &client_secret=${config.get("githubSecret")}`,
                method: "GET",
                headers: { "User-Agent": "ua" }
            }

            request(options, (error, response, body) => {
                if(error) console.error(error.message);

                if(response.statusCode !== 200) {
                    res.status(404).json({ msg: "No github profile found!" });
                }

                res.status(200).json(JSON.parse(body));
            })
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

module.exports = router;