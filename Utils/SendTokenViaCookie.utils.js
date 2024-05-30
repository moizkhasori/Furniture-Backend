import jwt from "jsonwebtoken"

export const sendTokenViaCookie = (id, statusCode, message, res, data = {}) => {

    const userId = jwt.sign({id}, process.env.JWT_SECRET)    

    res.status(statusCode).cookie("id", userId).json({
        sucess: true,
        message: message,
        data
    })

}