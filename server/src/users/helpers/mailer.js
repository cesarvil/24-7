"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(receiverEmail, code) {
  console.log(receiverEmail);
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "finalproject247_cesarvi247@hotmail.com", // generated ethereal user
        pass: "nodemailer247", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"24-7 Scheduler ⌛" <finalproject247_cesarvi247@hotmail.com>', // sender address
      to: receiverEmail, // list of receivers
      subject: `Shedule for ${new Date()}`, // Subject line // format later
      // text: "Hello world?", // plain text body
      html: `<!DOCTYPE> 
    <html>
      <body>
        <p>Your authentication code is : </p> <b>${code}</b>
      </body>
    </html>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

async function sendSchedule(req, res) {
  console.log("email");
  const receiverEmail = req.params.email;
  const scheduleId = req.params.scheduleId;
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "finalproject247_cesarvi247@hotmail.com", // generated ethereal user
        pass: "nodemailer247", // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"24-7 Scheduler ⌛" <finalproject247_cesarvi247@hotmail.com>', // sender address
      to: receiverEmail, // list of receivers
      subject: `Shedule for ${new Date()}`, // Subject line // format later
      // text: "Hello world?", // plain text body
      html: `<!DOCTYPE> 
    <html>
      <body>
        <p>Your SCHEDULE IS : </p> <b>${scheduleId}</b>
      </body>
    </html>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
    return { error: false };
  } catch (error) {
    console.error("send-email-error", error);
    return {
      error: true,
      message: "Cannot send email",
    };
  }
}

// sendEmail().catch(console.error);

module.exports = { sendEmail, sendSchedule };
