const mongoose = require('mongoose')
const Schema = mongoose.Schema
require('mongoose-currency').loadType(mongoose) // make use of that module and use the new type 
const Currency = mongoose.Types.Currency

const promotionSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true,
        default: ''
    },
    year: {
        type: String,
        required: true,
    },
    featured: {
        type: Boolean,
        default: false
    }
})

let Promotions = mongoose.model('Promotion',promotionSchema)

module.exports = Promotions