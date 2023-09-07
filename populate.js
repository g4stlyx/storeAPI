// this js file is for deleting everything in db and insterting the data inside products.json

require("dotenv").config()
const connectDB = require("./db/connect")
const Product = require("./models/product")
const jsonProducts = require("./products.json")


const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_URI)
        await Product.deleteMany()
        await Product.create(jsonProducts)
        console.log("Data inserted")
        process.exit(0)
    }catch(err){
        console.log(err)
    }
}

start()