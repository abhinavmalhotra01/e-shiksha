import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { addToPlaylist, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilePic, updateUserRole } from "../controllers/userController.js";
import { isAdmin, isAuth } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";


const router = express.Router();


// for register
router.route("/admin/stats").get(isAuth,isAdmin,getDashboardStats)

export default router;