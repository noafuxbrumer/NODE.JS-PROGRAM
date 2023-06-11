const mongoose = require("mongoose");
const Joi = require("joi");

const toysSchema = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    created_date: {
        type: Date, default: Date.now()
    },
    user_id: String
})
exports.ToysModel = mongoose.model("toys", toysSchema);
exports.validateToy = (_reqBody) => {
    const schemaJoi = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        info: String,
        category: String,
        img_url: Joi.string().min(2).max(500).allow(null, ""),
        price: Joi.number().min(1).max(9999).required()
    })
    return schemaJoi.validate(_reqBody);
}