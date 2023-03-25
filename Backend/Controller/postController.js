const postModel = require('../models/postModel')
const Errorhandler = require('../utills/errorHandler')
const catchAsyceError = require('../middleware/catchAsyncError')
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b:1024});

//create Post
exports.createPost =catchAsyceError( async (req,res) => {

    const post = await postModel.create({
        user: req.user._id,
        title:req.body.title,
        description:req.body.description,
        images:req.body.images,
        video : req.body.video,
        like:req.body.like
    });
    //Data Encryption
    const encrypted = key.encrypt(JSON.stringify(post) , 'base64')
    console.log(encrypted)
    //Data Decryption
    const decryptedPostData = key.decrypt(encrypted , 'utf8')
    console.log(decryptedPostData)
    //save Data
    post.save();
    return res.status(201).json({
        success:true,
        data : post
    })
});


//Get All Post of ---User
exports.getAllPost = catchAsyceError(async (req,res) =>{

    const post =await  postModel.find({})
    res.status(200).json({
        success:true,
        post
     })
})

// Get Post Details
exports.getPostDetails =catchAsyceError(async (req,res,next) => {
    const post = await postModel.findById(req.params.id)

    if(!post){
        return next(new Errorhandler("Post Not Found" , 404))
    }

    res.status(200).json({
        success:true,
       post
    })
});

//Update Post

exports.updatePost= catchAsyceError(async (req,res,next) => {

    let post = await postModel.findById(req.params.id)
    
    post = await postModel.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify: false
    })

    res.status(200).json({
        success:true,
        data : post
    })

    if(!post){
        return next(new Errorhandler("Post Not Found" , 404))
    }
});


//Delete Post

exports.deletePost = catchAsyceError(async (req,res,next) => {

    const post= await postModel.findByIdAndDelete(req.params.id)
    
    if(!post){
        return next(new Errorhandler("Post Not Found" , 404))
    }
   // await post.destroy()

    res.status(200).json({
        success:true,
        message : 'Post deleted Succesfully'
    })
});

//create Comment 
exports.createComment =catchAsyceError( async (req,res,next) => {

    const { postId } = req.body;
    const comment = req.body.comments.comment;
    const comments ={
        user: req.user._id,
        username:req.user.userName,
        comment : comment
    };
    const post =await postModel.findById(postId);

    if(!post){
        return next(new Errorhandler("Post Not Found" , 404))
    }

    post.comments.push(comments)
    await post.save()
    return res.status(201).json({
        success:true,
        data : post
    })
});

exports.createLike =catchAsyceError( async (req,res,next) => {

    const post = await postModel.findById(req.params.id)
    
    if(!post){
        return next(new Errorhandler("Post Not Found" , 404))
    }

    if(!post.like.includes(req.user._id)){
        if(post.disLike.includes(req.user._id)){
            await post.updateOne({$pull:{disLike:req.user._id}})
        }
        await post.updateOne({$push:{like:req.user._id}})
        res.status(200).json({
            success:true,
            message : 'Post Liked'
        })
    }else{
        await post.updateOne({pull:{like:req.user._id}})
        res.status(200).json({
            success:true,
            message : 'Post DisLiked'
        })
    }
    
});

exports.createDislike =catchAsyceError( async (req,res,next) => {

    const post = await postModel.findById(req.params.id)
    
    if(!post){
        return next(new Errorhandler("Post Not Found" , 404))
    }
    
    if(!post.disLike.includes(req.user._id)){
        if(post.like.includes(req.user._id)){
            await post.updateOne({$pull:{like:req.user._id}})
        }
        await post.updateOne({$push:{disLike:req.user._id}})
        res.status(200).json({
            success:true,
            message : 'Post DisLiked'
        })
    }else{
        await post.updateOne({pull:{like:req.user._id}})
        res.status(200).json({
            success:true,
            message : 'Post Liked'
        })
    }
    
});