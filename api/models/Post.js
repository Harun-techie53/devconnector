const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    text: {
        type: String, 
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            }
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user"
            },
            text: {
                type: String,
                required: true
            },
            likes: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "user"
                    }
                }
            ],
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            created_date: {
                type: Date,
                default: Date.now
            },
            updated_date: {
                type: Date
            }
        }
    ],
    created_date: {
        type: Date,
        default: Date.now
    },
    updated_date: {
        type: Date
    }
});

module.exports = Post = new mongoose.model('post', postSchema);