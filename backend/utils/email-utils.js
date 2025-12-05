// SendGrid email service (recommended for production on Render)
const sgMail = require('@sendgrid/mail');

// Legacy Nodemailer config (commented out - doesn't work on Render free tier due to SMTP port blocking)
// const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   secure: true,
//   auth: {
//     user: process.env.GOOGLE_EMAIL,
//     pass: process.env.GOOGLE_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, message) {
  if (!to) throw new Error("Recipient email (to) is required");
  if (!subject) throw new Error("Email subject is required");
  if (!message) throw new Error("Email message is required");

  // SendGrid implementation
  const msg = {
    to: to,
    from: process.env.SENDGRID_VERIFIED_EMAIL, // Must be verified in SendGrid
    subject: subject,
    text: message,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully via SendGrid to:", to);
  } catch (error) {
    console.error("Error sending email via SendGrid:", error);
    if (error.response) {
      console.error("SendGrid error details:", error.response.body);
    }
    throw error;
  }

  // Legacy Nodemailer implementation (commented out)
  // const mailOptions = {
  //   from: process.env.GOOGLE_EMAIL,
  //   to,
  //   subject,
  //   text: message,
  // };
  //
  // try {
  //   const info = await transporter.sendMail(mailOptions);
  //   console.log("Email sent: " + info.response);
  //   return info;
  // } catch (error) {
  //   console.error("Error sending email:", error);
  //   throw error;
  // }
}

module.exports = sendEmail;
