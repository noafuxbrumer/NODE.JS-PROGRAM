const experss = require("express");
const router = experss.Router();
const { validUser, UserModel, loginUser, createToken } = require("../model/userModel")
const bcrypt = require("bcrypt");
const { auth, authAdmin } = require("../middleware/auth");

router.post("/", async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "***";
        res.status(200).json(user);
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(500).json({ msg: "Email already in system, try log in", code: 11000 })
        }
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})
router.post("/login", async (req, res) => {
    let userValid = loginUser(req.body);
    if (userValid.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ msg: "The password or email is worng,code:2" });
        }
        let password = await bcrypt.compare(req.body.password,user.password);
        if(!password){
          return res.status(401).json({msg:"Password or email is worng ,code:1"});
        }
       
        let token = createToken(user._id, user.role); 
        res.status(201).json(token);
    } catch (err) {
        console.log(err);
        res.status(401).json({ msg: "err", err })
    }
})
router.get("/myInfo", auth, async (req, res) => {
    try {
        let userInfo = await UserModel.findOne({ _id: req.tokenData._id}, {password: 0 })
        res.status(201).json(userInfo);
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ msg: "err", err })
    }
})
router.delete("/:id", auth, async (req, res) => {
    try {
        let id = req.params.id;
        let data;
        if (req.tokenData.role == "admin") {
            data = await UserModel.deleteOne({ _id: id });
        }
        else if (id == req.tokenData._id) {
            data = await UserModel.deleteOne({ _id: id });
        }
        res.status(201);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})
router.get("/userList", authAdmin, async (req, res) => {
    try {
        let users = await UserModel.find({}, { password: 0 });
        res.status(201).json(users);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})
router.put("/:id", authAdmin, async (req, res) => {
    let validBody = validUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details)
    }
    try {
        let id = req.params.id;
        let data;
        if (req.tokenData.role == "admin") {
            data = await UserModel.updateOne({ _id: id }, req.body);
        }
        else if (id == req.tokenData._id) {
            data = await UserModel.updateOne({ _id: id }, req.body);
        }
        res.status(201).json(data);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "err", err })
    }
})
module.exports = router;