import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.LoginSMTP,
    pass: process.env.PasswordSMTP,
  },
});

export default transporter;
