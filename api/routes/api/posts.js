const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const auth = require("../../middleware/auth");
const Post = require("../../models/Post");
const User = require("../../models/User");

//@route    GET /api/post
//@desc     get all posts
//@access   Public
router.get(
    "/", 
    async (req, res) => {
        try {
            const posts = await Post.find();

            res.status(200).json(posts);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

//@route    POST /api/post
//@desc     user create a post
//@access   Private
router.post(
    "/",
    auth,
    [
        check("text", "Text is required")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() })
        }
        const { text } = req.body;
        try {
            const user = await User.findOne({ id: req.user.id }).select("-password");
            
            const post = new Post({
                user: req.user.id,
                name: user.name,
                avatar: user.avatar,
                text
            });

            await post.save();

            res.status(200).json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    POST /api/post/:postId
//@desc     user update a post
//@access   Private
router.put(
    "/:postId",
    auth,
    async (req, res) => {
        const { text } = req.body;
        try {
            await Post.findOneAndUpdate(
                { id: req.params.postId },
                { $set: { text, updated_date: Date.now() } },
                { new: true }
            );

            res.status(200).json("Post Updated Successfully");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)


//@route    POST /api/post/:postId/comment
//@desc     post comment on a post
//@access   Private
router.post(
    "/:postId/comment",
    auth,
    [
        check("text", "Text is required")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }

        const { text } = req.body;
        try {
            const user = await User.findOne({ id: req.user.id });
            let post = await Post.findOne({ id: req.params.postId });

            post.comments.unshift({
                user: req.user.id,
                name: user.name,
                avatar: user.avatar,
                text
            });

            await post.save();

            res.status(200).json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    DELETE /api/post/:postId
//@desc     delete post by id
//@access   Private
router.delete(
    "/:postId",
    auth,
    async (req, res) => {
        try {
            await Post.findOneAndRemove({ id: req.params.postId });
            res.status(200).json("Post Deleted Successfully");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    DELETE /api/post/:postId/comment/:commentId
//@desc     delete post comment by id
//@access   Private
router.delete(
    "/:postId/comment/:commentId",
    auth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            const removeIndex = post.comments.map((comment) => comment.id).indexOf(req.params.commentId);

            post.comments.splice(removeIndex, 1);

            await post.save();

            res.status(200).json("Comment Deleted Successfully");
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    POST /api/post/:postId/like
//@desc     post like post
//@access   Private
router.post(
    "/:postId/like",
    auth,
    async (req, res) => {
        try {
            const post = await Post.findOne({ id: req.params.postId });

            const userExist = post.likes.filter((item) => item.user.toString() === req.user.id).length > 0;

            if(userExist) {
                return res.status(400).json({ msg: "Post is already being liked" });
            }

            post.likes.unshift({
                user: req.user.id
            });

            await post.save();

            res.status(200).json(post);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    POST /api/post/:postId/unlike
//@desc     unlike a post
//@access   Private
router.post(
    "/:postId/unlike",
    auth,
    async (req, res) => {
        try {
            const post = await Post.findOne({ id: req.params.postId });

            const userExist = post.likes.filter((item) => item.user.toString() === req.user.id).length > 0;

            if(!userExist) {
                return res.status(400).json({ msg: "Post is not liked yet" });
            }

            const removeIndex = post.likes.map((item) => item.user.toString()).indexOf(req.user.id);

            post.likes.splice(removeIndex, 1);

            await post.save();

            res.status(200).json(post.likes);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    POST /api/post/:postId/comment/:commentId
//@desc     post a like on a comment
//@access   Private
router.post(
    "/:postId/comment/:commentId/like",
    auth,
    async (req, res) => {
        try {
            let post = await Post.findOne({ id: req.params.postId });
            let comment = post.comments.filter((comment) => comment.id === req.params.commentId);

            if(comment[0].likes.filter((item) => item.user.toString() === req.user.id).length > 0) {
                return res.status(400).json({ msg: "Comment is already being liked" });
            }

            comment[0].likes.unshift({
                user: req.user.id
            });

            await post.save();

            res.status(200).json(comment[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

//@route    POST /api/post/:postId/unlike
//@desc     unlike a post
//@access   Private
router.post(
    "/:postId/comment/:commentId/unlike",
    auth,
    async (req, res) => {
        try {
            let post = await Post.findOne({ id: req.params.postId });
            let comment = post.comments.filter((comment) => comment.id === req.params.commentId);

            if(comment[0].likes.filter((item) => item.user.toString() === req.user.id).length <= 0) {
                return res.status(400).json({ msg: "Comment is not liked yet" });
            }

            const removeIndex = comment[0].likes.map((item) => item.user).indexOf(req.user.id);
            comment[0].likes.splice(removeIndex, 1);

            await post.save();

            res.status(200).json(comment[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
)

module.exports = router;