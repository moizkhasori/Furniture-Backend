import multer from "multer";
import path from "path"
import ErrorHandler from "./ErrorHandler.js";

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, "./public/temp")
    },
    filename: function(req,file,cb){
        cb(null, `${Date.now()} - ${file.originalname}`)
    }
})

const fileFilter = (req,file,cb) => {

    const allowedFileTypes = /jpeg|jpg|png/
    const mimeType = allowedFileTypes.test(file.mimetype)
    const extensionName = allowedFileTypes.test(path.extname(file.originalname).toLowerCase())

    if(mimeType && extensionName){
        cb(null, true)
    }else{
        cb(new ErrorHandler("Only JPEG, JPG, PNG Files are allowed!", 400), false)
    }
}

const onError = function(err, next){
    next(err)
}

export const upload = multer({
    storage,
    fileFilter,
    onError
})