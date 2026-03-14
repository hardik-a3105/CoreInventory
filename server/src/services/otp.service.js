import prisma from '../utils/prisma.js'
import { generateOtp, otpExpiresAt } from '../utils/generateOtp.js'
import { sendOtpEmail } from '../utils/mailer.js'

export const createAndSendOtp = async (user) => {
  const code = generateOtp()

  await prisma.otp.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  })

  await prisma.otp.create({
    data: { userId: user.id, code, expiresAt: otpExpiresAt() },
  })

  await sendOtpEmail(user.email, code)
  return code
}

export const verifyOtp = async (userId, code) => {
  const otp = await prisma.otp.findFirst({
    where: { userId, code, used: false, expiresAt: { gt: new Date() } },
  })
  if (!otp) return false

  await prisma.otp.update({ where: { id: otp.id }, data: { used: true } })
  return true
}
