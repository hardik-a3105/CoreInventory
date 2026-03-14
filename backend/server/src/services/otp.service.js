import OTP from '../models/OTP.js'
import { generateOtp, otpExpiresAt } from '../utils/generateOtp.js'
import { sendOtpEmail } from '../utils/mailer.js'

export const createAndSendOtp = async (user) => {
  const code = generateOtp()

  // Mark previous OTPs as expired for this user
  await OTP.deleteMany({ userId: user._id })

  await OTP.create({ userId: user._id, code, expiresAt: otpExpiresAt() })

  await sendOtpEmail(user.email, code)
  return code
}

export const verifyOtp = async (userId, code) => {
  const otp = await OTP.findOne({
    userId,
    code,
    expiresAt: { $gt: new Date() },
  })
  if (!otp) return false

  // Delete the OTP after verification
  await OTP.deleteOne({ _id: otp._id })
  return true
}
