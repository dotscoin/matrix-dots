const express = require("express");
const router = express.Router();
const { get_wallet_balance, uuid_to_walletId } = require("./views");

router.get('/', (req, res) => {
    res.send({message:'index page for wallet'});
});

router.get('/get-balance', async(req, res) => {
    const uuid = req.query.uuid;
    const walletId =  await uuid_to_walletId(uuid)
    const walletBalance = await get_wallet_balance(walletId)
    res.send({walletBalance: walletBalance})
});

module.exports = router;