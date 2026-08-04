// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// import AppError from "../errors/AppError.js";
// dotenv.config();
// console.log(process.env.EMAIL);
// console.log(process.env.APP_PASS);
// async function sendVerificationEmail(user, token) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     secure: false,

//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.APP_PASS,
//     },
//   });
//   await transporter.sendMail({
//     from: process.env.EMAIL,
//     to: user.email,
//     subject: "Email verification",
//     html: `
//         Click on this link to verify your email
//         <a href='http://localhost:5001/auth/verify/:${token}'>Link</a>
//     `,
//   });
// }
// export { sendVerificationEmail };
import { resend } from "../config/resend.js";
import dotenv from "dotenv";
dotenv.config();

export async function sendVerificationEmail(user, token) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: user.email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>

      <a href="http://localhost:5001/auth/verify/${token}">
        Verify Email
      </a>
    `,
  });
}
