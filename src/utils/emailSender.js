const nodemailer = require("nodemailer");

exports.verifyEmail = async (email, token) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  });
  const link = `http://192.168.1.20:8082/auth/api/v1/verify`;
  const mail = process.env.GMAIL_ID;
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Email Verification",
    generateTextFromHTML: true,
    html: `
      <h2>Hi ${email}</h2>
      <h3>Please Verify your mail </h3>
      <p>Click <a href="${link}?email=${email}">here</a> to verify your email.</p>
      <h4>Thank you . </h4>
      <h5>Contact Developer <a href="mailto:${mail}">${mail}</a> </h5>
      `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Sent email ", email);
  } catch (error) {
    console.log("Error ", error);
  }
};

exports.resetEmail = async (email,link) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_ID,
      pass: process.env.GMAIL_PASS,
    },
  });
  const mail = process.env.GMAIL_ID;
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Reset Password",
    generateTextFromHTML: true,
    html: `
      <h2>Hi ${email}</h2>
      <h3>Reset Your Password </h3>
      <p>Click <a href="${link}">here</a> to reset .</p>
      <h4>Thank you . </h4>
      <h5>Contact Developer <a href="mailto:${mail}">${mail}</a> </h5>
      `,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Sent email ", email);
  } catch (error) {
    console.log("Error ", error);
  }
};
