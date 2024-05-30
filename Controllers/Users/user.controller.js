import { AsyncMiddleware } from "../../Middlewares/asyncMiddleware.js";
import ErrorHandler from "../../Utils/ErrorHandler.js";
import bcrypt from 'bcrypt'
import { QueryFromDb } from "../../Utils/DbPromisify.js"
import { sendTokenViaCookie } from "../../Utils/SendTokenViaCookie.utils.js";


// Regsiterting a User
export const handleSignupUser = AsyncMiddleware(async (req,res,next) => {

    const {first_name, middle_name, last_name, email, password} = req.body;

    if(!first_name || !last_name || !email || !password){
        return next(new ErrorHandler("all fields are mandatory to create an account.", 400))
    }

    if(password.length < 8){
        return next(new ErrorHandler("password must be of atleast 8 digits", 400))
    }

    const userAlreadyExists = await QueryFromDb("SELECT email from user where email = ?", [email])

    // first index either contains the userEmail or Undefined
    if(userAlreadyExists[0]){
        return next(new ErrorHandler("account with this email already exists.", 400))
    }


    const hashedPassword = await bcrypt.hash(password,10)

    const query = "INSERT INTO user(first_name, middle_name, last_name, email, user_password) VALUES(?,?,?,?,?)"
    const createduser = await QueryFromDb(query, [first_name, middle_name, last_name, email, hashedPassword])


    const id = createduser.insertId;
    const user = {
        first_name,
        middle_name, 
        last_name,
        email
    }

    sendTokenViaCookie(id,201,"user created successfully! check your email for confirmation message.", res, user)

})


// SigningIn a User
export const handleLoginUser = AsyncMiddleware(async (req,res,next) => {

    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("all fields are mandatory to login!"))
    }

    const UserExists = await QueryFromDb("SELECT user_id, first_name, middle_name, last_name, email, user_password FROM user WHERE email = ?", [email])

    if(!UserExists[0]){
        return next(new ErrorHandler("invalid email address. no account exists."))
    }

    const isPasswordMatched = await bcrypt.compare(password, UserExists[0].user_password)

    if(!isPasswordMatched){
        return next(new ErrorHandler("invalid password, please check again."))
    }

    const id = UserExists[0].user_id;
    const userWithoutPassword = Object.assign({}, UserExists[0]);
    delete userWithoutPassword.user_password;    

    sendTokenViaCookie(id, 200, "user logged in successfully!", res, userWithoutPassword)

})


// LoggingOut a User
export const handleLogoutUser = AsyncMiddleware(async (req,res,next) => {

    const options = {
        expires: new Date(Date.now())
    }

    res.status(200).cookie("id", null, options).json({
        success: true,
        message: "user loggedout successfully!"
    })

})