import dotenv from "dotenv"
dotenv.config({})



import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import errorMiddleware from "./Middlewares/error.middleware.js";


const app = express();

app.use(express.json())
app.use(cookieParser())

// app.use(cors({
//     origin: "afadsf",
//     credentials : true    
// }))

// importing routes
import userRouter from "./Routes/User/user.routes.js"
import productRouter from "./Routes/Product/product.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)


app.use(errorMiddleware)

app.listen(process.env.PORT, () => {
    console.log(`Server Started at Port - ${process.env.PORT}.`);
})

export default app;