import { AsyncMiddleware } from "../../Middlewares/asyncMiddleware.js";
import ErrorHandler from "../../Utils/ErrorHandler.js";
import { uploadMultipleImagesToCloudinary } from "../../Utils/cloudinary.js";
import {categoryArray} from "../../Utils/category.js"
import { QueryFromDb } from "../../Utils/DbPromisify.js";
import { unlinkImages } from "../../Utils/unlinkImages.utils.js";

export const handleCreateNewproduct = async (req,res,next) => {

    try {
        if(!req.files || req.files.length === 0){
            throw new ErrorHandler("images are mandatory to create a product!", 400)
        }
    
        const {
            name, 
            description,
            price,
            stock,
            category,
            subCategory,
            size,
            colors,
        } = req.body;
    
        if (!name || !description || !price || !category || !subCategory || !colors || !size || !stock ) {
            throw new ErrorHandler("all field are mandatory to create a new product!", 400)
        }
    
        if(description.length < 100){
            throw new ErrorHandler("description must be of atleast 100 characters!", 400)
        }
    
        if(price < 1){
            throw new ErrorHandler("price must be greater than 0!", 400)
        }
    
        if(stock < 0){
            throw new ErrorHandler("stock cannot be negative!", 400)
        }
    
    
        // check if a valid category is provided
        const categories = Object.keys(categoryArray);
        if(!categories.includes(category)){
            throw new ErrorHandler(`invalid category provided! supported categories are - ${categories}`, 400)
        }
    
        // check if a valid sub category is provided for a particular category
        const subCategoryArray = categoryArray[category];
        if(!subCategoryArray.includes(subCategory)){
            throw new ErrorHandler(`invalid sub-category provided! supported sub-categories for category - ${category} are - ${subCategoryArray}`, 400)
        }
    
        // converting color string and size string to an array
        const colorsArray = colors.split(",")
        const sizeArray = size.split(",")
    
        // write queries to get category id and subcategory id
        const categoryQuery = "SELECT category_id from category where category_name = ?"
        const categoryResult = await QueryFromDb(categoryQuery, [category])
        const category_id = categoryResult[0].category_id;
    
        if(!category_id){
            throw new ErrorHandler("invalid category!", 400)
        }
    
        const subCategoryQuery = "SELECT sub_category_id from sub_category where sub_category_name = ?"
        const subCategoryResult = await QueryFromDb(subCategoryQuery, [subCategory])
        const subCategory_id = subCategoryResult[0].sub_category_id;
    
        if(!subCategory_id){
            throw new ErrorHandler("invalid sub-category!", 400)
        }
    
    
        // product created by ko fix krna
        const productCreateQuery = "INSERT INTO product(product_name, product_description, product_price, product_stock, product_category_id, product_sub_category_id, product_created_by) VALUES(?,?,?,?,?,?,?)"
        const createdProduct = await QueryFromDb(productCreateQuery, [name, description, price, stock, category_id, subCategory_id, req.user.user_id])
        const createdProductID = createdProduct.insertId 
        
        colorsArray.forEach(async (color) => {
            const insertColorQuery = "INSERT INTO product_colors(product_id, product_color) VALUES(?,?)"
            await QueryFromDb(insertColorQuery, [createdProductID,color])
        })
    
        sizeArray.forEach(async (size) => {
            const insertSizeQuery = "INSERT INTO product_sizes(product_id, product_size, product_width, product_height) VALUES(?,?,?,?)"
            await QueryFromDb(insertSizeQuery, [createdProductID,size, 10,15])
        })
    
        const cloudinaryUploadedImagesInfo = await uploadMultipleImagesToCloudinary(req.files);
    
        cloudinaryUploadedImagesInfo.forEach(async(image) => {
            const insertImageInfoQuery = "INSERT INTO product_pictures(product_id, product_picture_url, product_picture_public_id) VALUES(?,?,?)"
            await QueryFromDb(insertImageInfoQuery, [createdProductID,image.url, image.publicID])
        })

        unlinkImages(req.files)

        res.status(201).json({
            success: true,
            message: "product created successfully",
            productId: createdProductID
        })

    } catch (error) {
        unlinkImages(req.files)
        error.statusCode ||= 500;
        error.message ||= "Interal Server Error";

        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        })
    }
}


