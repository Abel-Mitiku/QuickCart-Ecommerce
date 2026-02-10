import { error } from "console";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  const mailOptions = {
    from: `"Quick Cart" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: `Verify your email - Quick Cart`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #FF6B35;">Welcome to Quick Cart!</h2>
        <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationLink}" 
             style="background-color: #FF6B35; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          This link expires in 10 minutes.
           </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { message: "Verification email has been sent!", success: true };
  } catch (err: any) {
    return { error: err.message, success: false };
  }
}
