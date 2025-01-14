const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()
const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email: email, isAdmin: 1 })
        if (!user) return res.status(400).json({ message: "No admin found" })
        if (user.isAdmin == 1) {
            let token, refreshToken
            const passwordVerify = await bcrypt.compare(password, user.password)
            if (!passwordVerify) return res.status(400).json({ message: "invalid password" })
            token = await jwt.sign({ email: user.email, role: 'admin' }, process.env.ADMIN_ACCESS_TOKEN_KEY, { expiresIn: '7h' })
            refreshToken = await jwt.sign({ email: user.email }, process.env.ADMIN_REFRESH_TOKEN_KEY, { expiresIn: '7d' })
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                // sameSite:'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(200).json({ message: 'admin logged', token, user })
        }
    } catch (error) {
        console.log('admin login failed', error)
    }
}
const fetchUser = async (req, res) => {
    try {
        const { pageNumber } = req.params
        const page = parseInt(pageNumber, 10);
        const limit = 5
        const skip = (page - 1) * limit
        const users = await User.find().limit(limit).skip(skip)
        const totalDocuments=await User.find().countDocuments()
        const totalPages=Math.ceil(totalDocuments/limit)

        res.status(200).json({ message: 'users fetched', users ,totalPages})
    } catch (error) {
        return res.status(400).json({ message: 'failed to fetch the users list' })
    }
}

const editUser = async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatedUser) return res.status(400).json({ message: "the user is not edited" })
        return res.status(200).json({ message: "the user is edited" })

    } catch (error) {

    }
}

const refreshToken = async (req, res) => {

    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.status(400).json({ message: "no refresh token available login again" })
    try {
        const decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_KEY)
        const user = await User.findOne({ email: decoded.email })
        if (!user) return res.status(400).json({ message: "user not found" })
        const newAccessToken = jwt.sign({ email: user.email }, process.env.ADMIN_ACCESS_TOKEN_KEY)

        return res.status(200).json({ message: 'new token created', newAccessToken })
    } catch (error) {
        console.log(error)
        return res.status(403).json({ message: "error in creating new access token" })
    }
}

module.exports = {
    login,
    fetchUser,
    editUser,
    refreshToken
}


