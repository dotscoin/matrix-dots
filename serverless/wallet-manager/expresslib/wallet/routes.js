const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.send({message:'index page for wallet'});
});

router.

module.exports = router;