import express from "express"
import { handleLoginUser, handleLogoutUser, handleSignupUser } from "../../Controllers/Users/user.controller.js";
import { restrictToAdminOnly, restrictToLoggedInUserOnly, restrictToModeratorAndAdminOnly } from "../../Middlewares/restrictToLoggedInUserOnly.js";


const router = express.Router();

router.post("/signup", handleSignupUser)
router.post("/login", handleLoginUser)
router.get("/logout", restrictToLoggedInUserOnly, restrictToModeratorAndAdminOnly, handleLogoutUser)

export default router;