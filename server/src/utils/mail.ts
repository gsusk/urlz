import { User } from '@prisma/client';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';
import { EMAIL_TOKEN_CONFIG } from '@/constants/jwt';
import { generateToken } from './token';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.LoginSMTP,
    pass: process.env.PasswordSMTP,
  },
});

export const mailVerification = (
  user: Pick<User, 'username' | 'email' | 'isVerified'>,
) => {
  const token = generateToken(
    { username: user.username, email: user.email, isVerified: user.isVerified },
    EMAIL_TOKEN_CONFIG.secret,
    { algorithm: EMAIL_TOKEN_CONFIG.algorithm },
  );

  const mailOptions: Mail.Options = {
    from: `"URLzy" <santiagoxgames@gmail.com>`,
    to: user.email,
    subject: 'Your verification is almost complete!',
    text: `Welcome ${user.username ?? ''}! Your account verification is almost complete! Click here to verify: http://localhost.es`,
    html: `
      <header>
        <img src="cid:header_urlzy_logo" />
      </header>
      <h1>VERIFY YOUR ACCOUNT</h1>
      <div>
        <p>Welcome <b>${user.username ?? ''}</b>! 
        <br/> 
        Your account verification is almost complete! 
        </p>
        <br/>
        <p>Click <a href="http://localhost:5173/verify?token=${token}">here</a> to verify it!</p>
      </div>
      <br/>
      <div><small>If you didnt expect this email, you can safely ignore it.</small></div>
      `,
    attachments: [
      {
        cid: 'header_urlzy_logo',
        filename: 'logomd.png',
        path: path.relative('.', path.join('public', 'logomd.png')),
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error, 'ocurred an error on email sent');
      return;
    }
    console.log(info, 'success, email sent');
  });
};
