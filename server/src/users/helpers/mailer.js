"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(receiverEmail, code) {
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
//email schedule to all users from an specific schedule
async function emailSchedule(schedule, emails) {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "finalproject247_cesarvi247@hotmail.com", // generated ethereal user
        pass: "nodemailer247", // generated ethereal password
      },
    });

    let info = await transporter.sendMail({
      from: '"24-7 Scheduler ⌛" <finalproject247_cesarvi247@hotmail.com>', // sender address
      to: emails, // list of receivers
      subject: `Shedule for ${new Date()}`, // Subject line // format later
      html: `<!DOCTYPE> 
    <html>
      <body>
        <p>Schedule</b>
        ${schedule
          .map((day) => {
            return `<table style="border: 1px solid #999;
            padding: 2px;">
            <thead>
              <tr>
                <th style="border: 1px solid #999;
            padding: 2px;"> ${day.date.weekday} - ${day.date.dayMonth}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift1.name}</td>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift1.start}</td>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift1.end}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift2.name}</td>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift2.start}</td>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift2.end}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift3.name}</td>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift2.start}</td>
                <td style="border: 1px solid #999;
            padding: 2px;">${day.shift2.end}</td>
              </tr>
            </tbody>
          </table>`;
          })
          .toString()
          .replaceAll(",", " ")}// removing the commas from the mapped array
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

module.exports = { sendEmail, emailSchedule };
