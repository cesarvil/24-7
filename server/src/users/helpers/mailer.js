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
async function emailSchedule(schedule, emails, colors) {
  let emailSubject = `Schedule for the week of ${schedule[0].date.weekday} ${
    schedule[0].date.dayMonth
  } ${schedule[0]._id.toString().slice(0, 4)}`;

  try {
    const employeeColors = {
      navy: "#001f3f",
      blue: "#21a1fc",
      teal: "#21e2fc",
      yellow: "#f8fc21",
      green: "#40bd57",
      purple: "#e6a8ff",
      maroon: "#ffa8b8",
      silver: "#DDDDDD",
      red: "#FF4136",
      orange: "#FF851B",
      white: "#ffffff",
      black: "#000000",
    };
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
      subject: emailSubject, // Subject line // format later
      html: `<!DOCTYPE> 
    <html>
      <body >
        <h1>${emailSubject}</h1>
        ${schedule
          .map((day) => {
            return `<div><table style="border: 1px solid #999; margin: 10px auto;
                      padding: 2px; min-width : 300px; color: white; background: black; font-size: 16px">
            <thead>
              <tr>
                <th style="border: 1px solid #999;font-weight : bold; min-width : 200px;
                  padding: 2px;"> ${day.date.weekday} - ${
              day.date.dayMonth
            }</th>
                <th style="min-width : 50px; border: 1px solid #999;">Start</th>
                <th style="min-width : 50px; border: 1px solid #999;">End</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style= "width : 200px; text-align: center;
            padding: 2px; background : ${
              colors.filter((user) => user.name === day.shift1.name).length ===
              1
                ? employeeColors[
                    colors.filter((user) => user.name === day.shift1.name)[0]
                      .color
                  ]
                : "gray"
            };">${day.shift1.name}</td>
            <td style="width : 50px; text-align: center;
            padding: 2px; background : ${
              colors.filter((user) => user.name === day.shift1.name).length ===
              1
                ? employeeColors[
                    colors.filter((user) => user.name === day.shift1.name)[0]
                      .color
                  ]
                : "gray"
            };">${day.shift1.start}</td>
            <td style="width : 50px; text-align: center;
            padding: 2px; background : ${
              colors.filter((user) => user.name === day.shift1.name).length ===
              1
                ? employeeColors[
                    colors.filter((user) => user.name === day.shift1.name)[0]
                      .color
                  ]
                : "gray"
            };">${day.shift1.end}</td>
            <tr>
            <td style= "width : 200px; text-align: center;
        padding: 2px; background : ${
          colors.filter((user) => user.name === day.shift2.name).length === 1
            ? employeeColors[
                colors.filter((user) => user.name === day.shift2.name)[0].color
              ]
            : "gray"
        };">${day.shift2.name}</td>
        <td style="width : 50px; text-align: center;
        padding: 2px; background : ${
          colors.filter((user) => user.name === day.shift2.name).length === 1
            ? employeeColors[
                colors.filter((user) => user.name === day.shift2.name)[0].color
              ]
            : "gray"
        };">${day.shift2.start}</td>
        <td style="width : 50px; text-align: center;
        padding: 2px; background : ${
          colors.filter((user) => user.name === day.shift2.name).length === 1
            ? employeeColors[
                colors.filter((user) => user.name === day.shift2.name)[0].color
              ]
            : "gray"
        };">${day.shift2.end}</td>
          </tr>
          <tr>
          <td style= "width : 200px; text-align: center;
      padding: 2px; background : ${
        colors.filter((user) => user.name === day.shift3.name).length === 1
          ? employeeColors[
              colors.filter((user) => user.name === day.shift3.name)[0].color
            ]
          : "gray"
      };">${day.shift3.name}</td>
      <td style="width : 50px; text-align: center;
      padding: 2px; background : ${
        colors.filter((user) => user.name === day.shift3.name).length === 1
          ? employeeColors[
              colors.filter((user) => user.name === day.shift3.name)[0].color
            ]
          : "gray"
      };">${day.shift3.start}</td>
      <td style="width : 50px; text-align: center;
      padding: 2px; background : ${
        colors.filter((user) => user.name === day.shift3.name).length === 1
          ? employeeColors[
              colors.filter((user) => user.name === day.shift3.name)[0].color
            ]
          : "gray"
      };">${day.shift3.end}</td>
        </tr>
            </tbody>
          </table></div>`;
          })
          .toString()
          .replaceAll(",", " ")}<!--removing the commas from the mapped array-->
    <p>For more info, please login.</p> 
      </body>
    </html>`,
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
