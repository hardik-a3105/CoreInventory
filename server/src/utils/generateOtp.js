export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const otpExpiresAt = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() + 10) // expires in 10 minutes
  return d
}
