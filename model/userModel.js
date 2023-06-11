const mongoose = require("mongoose");
const Joi = require("joi")
const jws = require("jsonwebtoken");
const { config } = require("../config/secret");
const userSchema =new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date_created: {
        type: Date, default: Date.now()
    },
    role: {
        type: String, default: "user"
    }
})
exports.UserModel = mongoose.model("users", userSchema);

exports.createToken = (_id, role) => {
    let token = jws.sign({ _id, role },config.tokenSecret, { expiresIn: "60mins" });
    return token;
  }

exports.validUser = (_reqBody) => {
    const joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody);
}
exports.loginUser=(_reqBody)=>{
    const joiSchema=Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody);
}