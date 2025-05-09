require("dotenv").config();
const express = require("express")
const mongoose = require("mongoose")


const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))



function startApp() {
    console.log("hit", process.env.MONGODB_URL)
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("db connected");
            app.listen(port, () => console.log("server is listening on port", port))

        })
        .catch(() => console.log("something went wrong"))
}
startApp()