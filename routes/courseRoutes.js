import express from "express";
import { addLecture, createCourse, delCourse, delLecture, getAllCourses, getCourseLectures } from "../controllers/courseControllers.js";
import { isAdmin, isAuth } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";


const router = express.Router();

// get all courses without lectures
router.route("/courses").get(getAllCourses);
// create new course -> only admin
router.route("/createcourse").post(isAuth, isAdmin,  createCourse)
// add lectures // delete course // get course details 
router.route("/course/:id").get(isAuth, getCourseLectures).post(isAuth,isAdmin,singleUpload, addLecture).delete(isAuth,isAdmin,delCourse)
// delete lectures 
router.route("/lecture").delete(isAuth, isAdmin,delLecture)

export default router;