const experss = require("express");
const router = experss.Router();
const { ToysModel, validateToy } = require("../model/toysModel");
const { auth } = require("../middleware/auth")

router.delete("/:delId", auth, async (req, res) => {
    try {
        let id = req.params.delId;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ToysModel.deleteOne({ _id: id })
        }
        else {
            data = await ToysModel.deleteOne({ _id: id, user_id: req.tokenData._id })
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})
router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;
    try {
        let data = await ToysModel
            .find({})
            .limit(perPage)
            .skip((page - 1) * perPage).sort({ _id: -1 })

        res.status(200).json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})
router.get("/search", async (req, res) => {
    try {
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;
        let queryS = req.query.s;
        let searchReg = new RegExp(queryS, "i");
        let data = await ToysModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
            .limit(perPage).skip((page - 1) * perPage)
            .sort({ _id: -1 });
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }

})
router.get("/category/:catname", async (req, res) => {
    try {
        let perPage = req.query.perPage || 10;
        let page = req.query.page || 1;
        let catname = req.params.catname;
        let data = await ToysModel.find({ category: catname }).limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ _id: -1 })
        res.status(200).json(data);

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})
router.get("/single/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await ToysModel.find({ _id: id })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})
router.post("/", auth, async (req, res) => {
    let validbody = validateToy(req.body);
    if (!validbody) {
        return res.status(401).status(validbody.error.details)
    }
    try {
        let toy = new ToysModel(req.body);
        toy.user_id = req.tokenData._id;
        await toy.save();
        res.status(201).json(toy)
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ msg: "err", err })
    }
})
router.put("/:id", auth, async (req, res) => {
    try {
        let validbody = validateToy(req.body);
        if (!validbody) {
            return res.status(401).status(validbody.error.details)
        }
        let id = req.params.id;
        let data;
        if (req.body.role == "admin") {
            data = await ToysModel.updateOne({ _id: id }, req.body);
        }
        else {
            data = await ToysModel.updateOne({ _id: id, user_id: req.tokenData._id }, req.body);
        }
        res.status(201).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ msg: "err", err })
    }
})



module.exports = router;