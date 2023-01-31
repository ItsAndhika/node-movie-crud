import mongoose from "mongoose"
mongoose.connect("mongodb://127.0.0.1:27017/nodejs-crud")
mongoose.set("strictQuery", true)  