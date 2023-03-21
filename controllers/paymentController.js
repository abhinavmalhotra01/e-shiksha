import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { instance } from "../server.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/userModel.js";


export const buySubcription = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user._id)

    if(user.role==="admin"){
        return next(new ErrorHandler('no need to',400))
    }
    const plan_id = "plan_LTmfa4GazqB61x";
    const subcription = await instance.subscriptions.create({
        plan_id,
        customer_notify:1,
        quantity:5,
        total_count:12,
    })
    user.subcription.id = subsription.id;
    user.subscription.status = subscription.status;

    await user.save();
    res.status(201).json({
        success:true,
        subcription,
    })
})