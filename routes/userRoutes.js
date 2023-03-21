import express from "express";
import { addToPlaylist, changePassword, deleteMyProfile, deleteUser, forgetPassword, getAllUsers, getMyProfile, login, logout, register, removeFromPlaylist, resetPassword, updateProfile, updateProfilePic, updateUserRole } from "../controllers/userController.js";
import { isAdmin, isAuth } from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";


const router = express.Router();


// for register
router.route("/register").post(singleUpload, register)
// login
router.route("/login").post(login)
// logout
router.route("/logout").get(logout)
// get my profile
router.route("/me").get(isAuth,  getMyProfile)
// change password
router.route("/changepassword").put(isAuth,changePassword)
// update profile
router.route("/updateprofile").put(isAuth,updateProfile)
// update profile pic
router.route("/updateprofilepic").put(isAuth,updateProfilePic)
// del profile
router.route("/deleteprofile").delete(isAuth,deleteMyProfile)
// forget password-> token read
router.route("/forgetpassword").post(forgetPassword)
// reset password -> using token , change 
router.route("/resetpassword/:token").put(resetPassword)
// add to playlist
router.route("/addtoplaylist").post(isAuth,addToPlaylist)
// remove from playlist
router.route("/removefromplaylist").delete(isAuth,removeFromPlaylist)



// admin 

router.route("/admin/users").get(isAuth,isAdmin,getAllUsers)
router.route("/admin/user/:id").put(isAuth,isAdmin,updateUserRole).delete(isAuth,isAdmin,deleteUser)

export default router;