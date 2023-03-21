import express from "express";
import { buySubcription } from "../controllers/paymentController.js";
import { isAuth } from "../middlewares/auth.js";


const router = express.Router();

router.route("/subscribe").post(isAuth,buySubcription)


export default router;