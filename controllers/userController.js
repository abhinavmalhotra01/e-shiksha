import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import {User} from "../models/userModel.js"
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { Course } from "../models/courseModel.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import { Stats } from "../models/Stats.js";


export const register = catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;
    // const file = req.file;

    if(!name || !email || !password){
        return next(new ErrorHandler('Please fill all fields',400));
    }

    let user = await User.findOne({email});
    if(user){
        return next(new ErrorHandler('EMail already registered',409));
    }

    // const file = req.file;
    // const fileUri = getDataUri(file)
    // const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
// 
    user = await User.create({
        name , email , password, avatar : {
            public_id : "mycloud.public_id",
            url:"mycloud.secure_url",
        },
    }),

    sendToken(res,user,'Registered Successfully',201)

});


export const login = catchAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;

    // const file = req.file;

    if(!email || !password){
        return next(new ErrorHandler('Please fill all fields',400));
    }

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler('User doesnt exist',401));
    }


    const isMatch = await user.comparePassword(password);

    if(!isMatch){
        return next(new ErrorHandler('Password and EMail dont match',401))
    }

    sendToken(res,user,`Hello ${user.name}`,200)

});

export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("token",null,{
        expires : new Date(Date.now()),
    }).json({
        success: true,
        message:"logged out successfully"
    })
})

export const getMyProfile = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    res.status(200).json({
        success: true,
        user,
    })
})


export const changePassword = catchAsyncError(async(req,res,next)=>{
    const {oldPassword,newPassword} = req.body;
    if(!oldPassword || !newPassword){
        return next(new ErrorHandler('Please fill all fields',400));
    }
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if(!isMatch){
        return next(new ErrorHandler('Incorrect Old Password',400));
    }
    user.password=newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: "password changed",
    })
})

export const updateProfile = catchAsyncError(async(req,res,next)=>{
    const {name,email} = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if(name){
        user.name = name;
    }
    if(email){
        user.email=email;
    }
    await user.save();
    res.status(200).json({
        success: true,
        message: "profile updated",
    })
})
export const updateProfilePic = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    // const file = req.file;
    // const fileUri = getDataUri(file)
    // const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    // await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    user.avatar={
        public_id : "mycloud.public_id",
        url: "mycloud.secure_url",
    };
    await user.saver();
    res.status(200).json({
        success: "true",
        message:"profile picture updated",
    })
})
export const forgetPassword = catchAsyncError(async(req,res,next)=>{
    const {email}=req.body;
    const user = await User.findOne({email});
    if(!user){
        return next(new ErrorHandler('User not found',400));
    }
    const resetToken = await user.getResetToken();
    await user.save();
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`
    const message =  `Click on the link to reset your password. ${url}. If you have not requested , then please ignore.`
    await sendEmail(user.email,"RESET PASSWORD",message)
    res.status(200).json({
        success: "true",
        message:"reset token sent to your email",
    })
})
export const resetPassword = catchAsyncError(async(req,res,next)=>{
    const {token} = req.params;
    const resetPasswordToken= crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
            $gt: Date.now(),
        },
    })
    if(!user){
        return next(new ErrorHandler('Token is invalid or expired',400));
    }
    user.password = req.body.password;
    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;
    await user.save()
    res.status(200).json({
        success: "true",
        message:"password changed",
    })
})

export const addToPlaylist = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.body.id)
    if(!course){return next(new ErrorHandler('Invalid Course Id',404))}
    const itemExist=user.playlist.find((item)=>{
        if(item.course.toString()===course._id.toString()){return true;}
    })
    if(itemExist){
        return next(new ErrorHandler('Course already present in playlist',409))
    }
    user.playlist.push({
        course: course._id,
        poster: course.poster.url,
    })
    await user.save()
    res.status(200).json({
        success: true,
        message : "Added to playlist"
    })
})

export const removeFromPlaylist = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    const course = await Course.findById(req.query.id)
    if(!course){return next(new ErrorHandler('Invalid Course Id',404))}
    const newPlaylist = user.playlist.filter(item=>{
        if(item.course.toString()!==course._id.toString()){return item;}
    })
    user.playlist = newPlaylist;
    await user.save()
    res.status(200).json({
        success: true,
        message : "Removed from playlist"
    })
})
// admin
export const getAllUsers = catchAsyncError(async(req,res,next)=>{
    const users = await User.find({});
    res.status(200).json({
        success: true,
        users
    })
})
export const updateUserRole = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("user doesnt exist",404))
    }
    if(user.role==="user"){
        user.role="admin"
    }else{
        user.role="user"
    }
    await user.save();
    res.status(200).json({
        success: true,
        message : "updated"
    })
})
export const deleteUser = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("user doesnt exist",404))
    }
    
    await user.remove();
    res.status(200).json({
        success: true,
        message : "deleted"
    })
})
export const deleteMyProfile = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id);
    
    await user.remove();
    res.status(200).cookie("token",null,{
        expires:new Date(Date.now()),}).json({
        success: true,
        message : "deleted"
    })
})



User.watch().on("change",async ()=>{
    const stats = await Stats.find({}).sort({createdAt:"desc"}).limit(1);
    stats[0].users = await User.countDocuments();
    stats[0].createdAt = new Date(Date.now());

    await stats[0].save();
})