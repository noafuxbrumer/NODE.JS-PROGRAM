const express = require("express")
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "localhost is good" })
})
module.exports = router