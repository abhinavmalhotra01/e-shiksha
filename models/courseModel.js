import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Enter the title of the course"],
        minLength:[4,"Title must have atleast 4 characters"],
        maxLength:[80,"Title cannot exceed 80 characters"],
    },
    description:{
        type:String,
        required:[true,"Enter the title of the course"],
        minLength:[20,"Description must have atleast 20 characters"],
    },
    lectures:[
        {
            title:{
                type:String,
                required:true,
            },
            description:{
                type:String,
                required:true,
            },
            video:{
                public_id:{
                    type:String,
                    required:true,
                },
                url:{
                    type:String,
                    required:true,
                },
            },
        },
    ],
    poster:{
        public_id:{
            type: String,
            required:false,
        },
        url:{
            type: String,
            required:false,
        },
    },
    views:{
        type:Number,
        default:0,
    },
    numOfVideos:{
        type:Number,
        default:0,
    },
    category:{
        type:String,
        required:true,
    },
    createdBy:{
        type:String,
        required:[true,'Enter the name of the creator']
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});



export const Course = mongoose.model("Course",schema);