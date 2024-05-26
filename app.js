import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import errorMiddleware from "./Middlewares/error.middleware.js";
import { AsyncMiddleware } from "./Middlewares/asyncMiddleware.js";
import { QueryFromDb } from "./Utils/DbPromisify.js";


const app = express();

app.use(express.json())
app.use(cookieParser())

// app.use(cors({
//     origin: "afadsf",
//     credentials : true    
// }))

app.get("/", AsyncMiddleware(async(req,res,next) => {
    const data = await QueryFromDb("select 8 from users")
    res.json({data})
}))

app.use(errorMiddleware)

app.listen(4000, () => {
    console.log("db");
})

export default app;