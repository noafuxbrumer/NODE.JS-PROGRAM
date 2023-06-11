const index=require("./index");
const toy=require("./toys");
const user=require("./users")

exports.routesInit=(app)=>{
    app.use("/",index);
    app.use("/toys",toy);
    app.use("/users",user)
}