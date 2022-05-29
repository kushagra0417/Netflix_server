import sgMail from '@sendgrid/mail';
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


const welcomeMsg = {
  to: '', // Change to your recipient
  from: 'choithwanikushagra@gmail.com', // Change to your verified sender
  subject: 'Welcome Message',
  text: 'Welcome to NetFlix',
  html: '<strong>Welcome to NetFlix</strong>',
}
export function signUpEmail(email){
  welcomeMsg.to=email;
  console.log(welcomeMsg.to)
  sgMail
  .send(welcomeMsg)
  .then((response) => {
    console.log(response[0].statusCode)
    console.log(response[0].headers)
  })
  .catch((error) => {
    console.error(error)
  })
}

//filepathRef:server/emailing.js
//RESET PASSWORD SENDGRID CODE
export function resetPswdEmail(user,token){
    const ResetPswdMsg = {
      to: user.email, // Change to your recipient
      from: 'choithwanikushagra@gmail.com', // Change to your verified sender
      subject: 'Reset Password',
      text: 'Reset password',
      html: `<p>A request for password reset has been generated from your account.</p>
      <h5>Click on this <a href="${process.env.FRONTEND}/reset/${token}">Link</a> to reset password</h5>`,
    }
    console.log(ResetPswdMsg.to)
    sgMail
    .send(ResetPswdMsg)
    .then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => {
      console.error(error)
    })
  }