const User = require('../models/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose')
require('dotenv').config()

function genarateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

async function sendVerificationMail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD,
            }
        })

        const info = await transporter.sendMail({
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: 'verify your email',
            text: `your OTP is ${otp}`,
            html: `<b> your OTP ${otp} </b>`
        })
        return info.accepted.length > 0
    } catch (error) {
        console.log('error sending email', error)
        return false
    }
}

const signup = async (req, res) => {
    const { firstname, lastname, email, phoneNumber, password } = req.body
    req.session.user = { firstname, lastname, email, phoneNumber, password }
    req.session.email = email
    console.log(req.session.user)
    try {
        const exisitingUSer = await User.findOne({ email })
        if (exisitingUSer) {
            return res.status(400).json({ message: "the user is already exist" })
        }

        const ogOtp = genarateOtp()
        const emailSent = await sendVerificationMail(email, ogOtp)
        req.session.otp = ogOtp

        console.log(emailSent)

        if (!emailSent) {
            return res.json({ "message": "invalid-email" })
        } else {
            return res.status(200).json({ message: "otp sent" })
        }

    } catch (error) {
        console.log('error in sending the email ', error)
        res.status(500).json({ message: "internal server error", error })
    }

}

const securePassword = async (password) => {
    try {
        const sPassword = await bcrypt.hash(password, 10)
        return sPassword
    } catch (error) {
        console.log(error)
    }
}

const otpVerification = async (req, res) => {
    const { otp } = req.body

    // console.log(req.session)
    const { firstname, lastname, email, phoneNumber, password } = req.session.user
    const sPassword = await securePassword(password)

    try {
        if (!req.session.otp || req.session.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (otp == req.session.otp) {
            const user = new User({
                firstName: firstname,
                lastName: lastname,
                email,
                password: sPassword,
                phoneNo: phoneNumber,
                status: 'active',
                isAdmin: 0
            })
            await user.save()
            console.log(user)
            return res.json({ message: "user created" })
        } else {
            return res.json({ message: "invalid otp " })
        }

    } catch (error) {
        console.log(error)
    }
}

const resendOtp = async (req, res) => {
    const email = req.session.email

    try {
        const ogOtp = await genarateOtp()
        const emailVerification = await sendVerificationMail(email, ogOtp)
        if (emailVerification) {
            req.session.otp = ogOtp

            console.log(req.session.otp)
            res.status(200).json({ message: "the resend otp done" })
        } else {
            res.status(400).json({ message: "invalid mail in resend otp" })
        }

    } catch (error) {
        console.log('error in the resendOtp', error)
        res.status(500).json({ message: "error in resending the otp" })
    }

}

const googleSave = async (req, res) => {
    const { email, email_verified, firstName, id } = req.body
    console.log(email, email_verified, firstName, id)
    try {
        const exisitingUSer = await User.findOne({ email })
        if (exisitingUSer) {
            return res.status(400).json({ message: "the email is already exist" })
        }
        const newUser = new User({
            firstName,
            email,
            status: 'active',
            googleId: id,
            isAdmin: 0,
            GoogleVerified: email_verified

        })
        await newUser.save()
        return res.status(201).json({ message: "the user created" })
    } catch (error) {
        console.log('google user is not saved', error)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)

    try {
        console.log(mongoose.connection.readyState)
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "the user not found" })
        } else {
            let token, refreshToken
            if (user.status == 'inactive') return res.status(400).json({ message: "the user is blocked by admin" })
            if (user.googleId) {
                token = await jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d' })
                refreshToken = await jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' })
                // return res.status(200).json({message:"the user logged",user,token,refreshToken})
                console.log(refreshToken)


            } else {
                const isPasswordValid = await bcrypt.compare(password, user.password)
                if (!isPasswordValid) return res.status(400).json({ message: "invalid password" })
                token = await jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1d' })
                refreshToken = await jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRET_KEY, { expiresIn: '7d' })
                // return res.status(200).json({message:"the user logged",user,token,refreshToken})
                console.log(refreshToken)
            }

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                maxAge: 7 * 24 * 60 * 60 * 1000
            })
            return res.status(200).json({ message: "user logged", user, token })
        }

    } catch (error) {
        console.log('login failed', error.message)
        return res.status(500).json({ message: "login failed" })
    }
}

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) return res.status(401).json({ message: "no refresh token available" })

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)
        const user = await User.findOne({ email: decoded.email })
        if (!user) return res.status(400).json({ message: "user not found" })

        const newAccessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET_KEY, { expiresIn: '1h' })
        return res.status(200).json({ message: "new token created", accessToken: newAccessToken })
    } catch (error) {
        console.log('creting the new access token error', error.message)
        return res.status(403).json({ message: "error in creating the new access token" })
    }
}

const changePassword = async (req, res) => {
    try {
        const { userId } = req.params
        const { formData } = req.body
        console.log(userId)

        const oldPassword = formData.oldPassword
        const newPassword = formData.newPassword
        const confirmPassword = formData.confirmPassword
        console.log(oldPassword, newPassword, confirmPassword);

        const user = await User.findById(userId, 'password')
        console.log(user.password)
        if (!user) return res.status(400).json({ message: "no user found" })
        const oldPasswordVerify = await bcrypt.compare(oldPassword, user.password)
        if (!oldPasswordVerify) return res.status(400).json({ message: 'old password is wrong' })
        if (newPassword == confirmPassword) {
            const newHashedPassword = await securePassword(newPassword)
            console.log(newHashedPassword, 'this is new')
            user.password = newHashedPassword
            await user.save()
            return res.status(200).json({ message: 'password changed' })
        } else {
            return res.status(400).json({ message: 'password and confirm password not equal' })
        }
        console.log(oldPasswordVerify)
    } catch (error) {
        console.log('error while changing the password', error)
        return res.status(500).json({ message: 'error while changing password' })
    }
}

const changeInformation = async (req, res) => {
    try {
        const { userId } = req.params
        const { formData } = req.body
        console.log(userId, formData)
        const user = await User.findById(userId, 'firstName lastName phoneNo email')
        if (!user) return res.status(400).json({ message: "no user found" })
        const allUser = await User.find()
        const existingEmail = allUser.find((user) => user.email == formData.email)
        console.log('this is teh existing email', existingEmail)
        if (existingEmail) return res.status(400).json({ message: 'the email is already exist' })
        console.log('this is the existing user', user)
        user.firstName = formData.firstName
        user.lastName = formData.lastName
        await user.save()
        return res.status(200).json({ message: 'User info Changed' })
    } catch (error) {
        console.log('error while changin the info of the user', error)
        return res.status(500).json({ message: "error while changing the info of the user" })
    }
}


module.exports = {
    signup,
    otpVerification,
    resendOtp,
    googleSave,
    login,
    refreshToken,
    changePassword,
    changeInformation,


}