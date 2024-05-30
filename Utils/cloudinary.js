import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
dotenv.config({})
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
})

export const uploadMultipleImagesToCloudinary = async (filesArray) => {

    try {

        const folder = "furniture/products";
        const promises = filesArray.map(async (file) => {
            const result = await cloudinary.uploader.upload(file.path, {folder})
            return {publicID: result.public_id, url: result.url}
        })

        const uploadImagesInfo = await Promise.all(promises);
        return uploadImagesInfo;


    } catch (error) {
        throw error;
    }

}