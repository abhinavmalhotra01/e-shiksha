import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Stats } from "../models/Stats.js";

export const getDashboardStats = catchAsyncError(async(req,res,next)=>{
    const stats = await Stats.find({}).sort({createdAt:"desc" }).limit(12);
    const statsData = [];
    const reqSize = 12-stats.length;
    for(let i=0;i<stats.length;i++){
        statsData.unshift(stats[i]);
    }
    for(let i=0;i<reqSize;i++){
        statsData.unshift({
            user:0,
            views:0,
        })
    }
    const usersCount = statsData[11].user;
    const viewsCount = statsData[11].views;
    let usersProfit = true, viewsProfit = true;
    let usersPercent = 0, viewsPercent = 0;
    if(statsData[10].user===0){usersPercent=usersCount*100;}
    if(statsData[10].views===0){viewsPercent=viewsCount*100;}
    else{
        const difference = {
            user:statsData[11].user-statsData[10].user,
            views:statsData[11].views-statsData[10].views, 
        }
        usersPercent=(difference.user/statsData[10].user)*100;
        viewsPercent=(difference.views/statsData[10].views)*100;
        if(usersPercent<0){usersProfit=false;}
        if(viewsPercent<0){viewsProfit=false;}
    }
    res.status(200).json({
        success:true,
        stats: statsData,
        usersCount,
        viewsCount,
        usersPercent,
        viewsPercent,
        usersProfit,
        viewsProfit,
    })
})