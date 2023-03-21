const mongoose = require('mongoose');

const postSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    video: {
        type: String,
    },
    like: {
        type: Array,
    },
    disLike:{
        type:Array,
},
    comments: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true,
            },
            username: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
const postModel = new mongoose.model("post", postSchema)

module.exports = postModel;