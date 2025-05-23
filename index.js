require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors")
const userRouter = require("./route/userRouter")
const blogRouter = require("./route/blogRouter")

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use("/api/v1/user/", userRouter);
app.use("/api/v1/", blogRouter)



function startApp() {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("db connected");
            app.listen(port, () => console.log("server is listening on port", port))

        })
        .catch(() => console.log("something went wrong"))
}
startApp()