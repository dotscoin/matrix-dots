const express = require("express");
const router = express.Router();
const { get_wallet_balance, uuid_to_walletId, update_wallet_balance } = require("./views");

router.get('/', (req, res) => {
    res.send({message:'index page for wallet'});
});

router.get('/get-balance', async(req, res) => {
    const uuid = req.query.uuid;
    const walletId =  await uuid_to_walletId(uuid)
    if (!walletId) res.send({message:'invalid uuid number'})
    const walletBalance = await get_wallet_balance(walletId)
    res.send({walletBalance: walletBalance})
});

router.get('/update-balance', async (req, res) => { // adding the new balance with the existing balance
    const uuid = req.query.uuid;
    const newWalletBalance = parseFloat(req.query.balance);
    console.log(newWalletBalance);
    const walletId = await uuid_to_walletId(uuid)
    const oldWalletBalance = await get_wallet_balance(walletId)
    const updatedWalletBalance = (newWalletBalance+oldWalletBalance);
    const message = await update_wallet_balance(walletId, updatedWalletBalance)
    const walletBalanceAfter = await get_wallet_balance(walletId)
    res.send({message:'wallet balance updated.', updated_wallet_balance: walletBalanceAfter})
})

module.exports = router;