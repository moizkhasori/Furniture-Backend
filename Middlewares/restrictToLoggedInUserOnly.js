import { QueryFromDb } from "../Utils/DbPromisify.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { AsyncMiddleware } from "./asyncMiddleware.js";
import jwt from "jsonwebtoken"

export const restrictToLoggedInUserOnly = AsyncMiddleware(async (req,res,next) => {

    const {id} = req.cookies;

    if(!id){
        return next(new ErrorHandler("please login first to access this resource", 401))
    }

    const decoded = jwt.verify(id, process.env.JWT_SECRET)

    const findUser = await QueryFromDb("SELECT user_id,first_name, middle_name, last_name, email, user_role FROM user WHERE user_id = ?", [decoded.id])

    if(!findUser[0]){
        return next(new ErrorHandler("invalid user id, login again"))
    }

    req.user = findUser[0]
    next()

})



export const restrictToModeratorAndAdminOnly = AsyncMiddleware(async (req,res,next) => {

    const userRole = req.user?.user_role
    if(!userRole){
        return next(new ErrorHandler("login issue, please login again"));
    }

    const authorizedRoles = ["admin", "moderator"];

    if(!authorizedRoles.includes(userRole)){
        return next(new ErrorHandler("you dont have enough permissions to access this resource (moderators & admins only)."))
    }

    next()

})


export const restrictToAdminOnly = AsyncMiddleware(async (req,res,next) => {

    const userRole = req.user?.user_role
    if(!userRole){
        return next(new ErrorHandler("login issue, please login again"));
    }

    const authorizedRoles = ["admin"];

    if(!authorizedRoles.includes(userRole)){
        return next(new ErrorHandler("you dont have enough permissions to access this resource (admins only)."))
    }

    next()

})
