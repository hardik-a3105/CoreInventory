import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'CoreInventory — Password Reset OTP',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2 style="color:#1a1a1a">Password Reset</h2>
        <p>Use the OTP below to reset your password. It expires in <b>10 minutes</b>.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;
                    background:#f4f4f4;padding:16px;text-align:center;
                    border-radius:8px;margin:24px 0">
          ${otp}
        </div>
        <p style="color:#666;font-size:13px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  })
}
