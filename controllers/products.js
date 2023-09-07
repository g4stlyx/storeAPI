const Product = require("../models/product")

const getAllProductsStatic = async (req,res) =>{
    const products = await Product.find({}).sort("-name price")
    res.status(200).json({amount:products.length,products})
}

const getAllProducts = async (req,res) =>{
    const {featured,company,name,sort,fields,numericFilters} = req.query
    const queryObject = {}

    // search, filtering
    if(featured){
        queryObject.featured = featured === "true" ? true : false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = {$regex: name , $options: "i"}
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '<':'$lt',
            '>=' : '$gte',
            '<=' : '$lte',
            '=' : '$eq'
        }
        const regEx = /\b(<|>|>=|=|<=)\b/g
        let filters = numericFilters.replace(regEx, match=>`-${operatorMap[match]}-`)

        const options = ["price","rating"]
        filters = filters.split(",").forEach(item=>{
            const [field,operator,value] = item.split("-")
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }

    let result = Product.find(queryObject)

    // sort
    if(sort){
        const sortList = sort.split(",").join(" ")
        result = result.sort(sortList)
    }
    else{
        result = result.sort("createdAt")
    }

    // select /fields
    if(fields){
        const fieldsList = fields.split(",").join(" ")
        result = result.select(fieldsList)
    }

    // limit,skip, pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit

    result = result.skip(skip).limit(limit)

    const products = await result
    res.status(200).json({amount:products.length,products})
}

module.exports = {
    getAllProducts,
    getAllProductsStatic
}