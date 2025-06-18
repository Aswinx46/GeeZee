const StatusCodes = require('../enums/httpStatusCode')
const User = require('../models/userSchema')
const Wallet = require('../models/WalletSchema')

const getWalletDetails = async (req, res) => {
    try {
        const { userId } = req.params
        const wallet = await Wallet.findOne({ userId })
        if (!wallet) return res.status(StatusCodes.BAD_REQUEST).json({ message: "no Wallet found" })

        return res.status(StatusCodes.OK).json({ message: 'Wallet Created', wallet })
    } catch (error) {
        console.log('error while fetching wallet details', error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'error while fetching wallet details', error })
    }

}

module.exports = {
    getWalletDetails
}