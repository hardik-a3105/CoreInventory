import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Using a professional transporter setup
// Note: User needs to provide actual SMTP credentials in .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️ SMTP credentials not found. Email not sent. OTP is logged below.');
      return false;
    }
    await transporter.sendMail({
      from: `"CoreInventory" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✅ OTP Email successfully sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email send error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return false;
  }
};
