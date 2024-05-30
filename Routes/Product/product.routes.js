import express from "express";
import { handleCreateNewproduct } from "../../Controllers/Products/product.controller.js";
import { upload } from "../../Utils/multerConfig.utils.js";
import { restrictToAdminOnly, restrictToLoggedInUserOnly } from "../../Middlewares/restrictToLoggedInUserOnly.js";


const router = express.Router();

router.post("/newproduct", restrictToLoggedInUserOnly, restrictToAdminOnly, upload.array("productimages",10), handleCreateNewproduct)

export default router;