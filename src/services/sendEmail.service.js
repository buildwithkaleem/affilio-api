
import nodemailer from "nodemailer";
// import config from "../config/config.js";

export const sendEmail = async (to, subject, htmlData) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Affilio Team" ${process.env.FROM_EMAIL}`,
    to,
    subject,
    html: htmlData,
  });
};



// export const sendEmail = async (to, subject, htmlData) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"PocketMoney Team" ${process.env.FROM_EMAIL}`,
//     to,
//     subject,
//     html: htmlData,
//   });
// };