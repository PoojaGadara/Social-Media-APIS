const express = require('express');
const mongoose = require('mongoose');
const { createPost, getAllPost, getPostDetails, updatePost ,deletePost, createComment ,createLike ,createDislike} = require('../Controller/postController');
const router = express.Router();
const {isAuthenticateUser } = require('../middleware/auth')

//create Post
router.route('/post/new').post(isAuthenticateUser ,createPost)

//Get All Post
router.route('/user/posts').get(isAuthenticateUser ,getAllPost)

//Get Single Post
router.route('/post/:id')
.get(isAuthenticateUser ,getPostDetails)
.put(isAuthenticateUser ,updatePost)
.delete(isAuthenticateUser ,deletePost)

//create Comments
router.route('/comment/create').put(isAuthenticateUser , createComment)

//Create Like
router.route('/:id/like').put(isAuthenticateUser , createLike)

//Create DisLike
router.route('/:id/dislike').put(isAuthenticateUser , createDislike)

module.exports = router; 