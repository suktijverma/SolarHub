const nodemailer = require("nodemailer");
const sendEmail = (receiver_id, fullNameUser) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL, //replace with your email
      pass: process.env.SENDER_PASSWORD, //replace with your password
    },
  });

  var mailOptions = {
    from: process.env.SENDER_EMAIL, //replace with your email
    to: receiver_id, //replace with your email
    subject: `Contact name: ${"req.body.name"}`,
    html: `<html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Splurge</title>
      <style>
        @import url("https://fonts.googleapis.com/css?family=Roboto");
        a {
          text-decoration: none;
        }
  
        a:hover {
          text-decoration: none;
          cursor: pointer;
        }
        .body {
          font-family: "Roboto";
          max-width: 600px;
          margin: 0 auto;
          background: rgba(68, 68, 68, 0.1);
          color: #000000 !important;
        }
        .common-btn {
          background: #6f31ff;
          color: white;
          border-radius: 31px;
          width: 180px;
          height: 50px;
          outline: 0;
          border: 1px solid #ffffff;
          font-weight: 400 !important;
          font-size: 16px;
          font-family: "Roboto";
          cursor: pointer;
        }
        .hand-make-btn {
          background: #ffffff;
          border: 1px solid #000000;
          box-sizing: border-box;
          border-radius: 32px;
          padding: 13px;
          outline: 0;
          font-size: 14px;
          margin-top: 16px;
          font-weight: 400 !important;
          font-family: "Roboto";
        }
        .unsubscribe {
          font-size: 13px;
          margin-top: 30px;
          text-align: center;
          font-weight: 400;
        }
        .contact_us {
          margin-top: 95px !important;
          text-align: center;
          width: 100px;
          margin: 0 auto;
        }
        @media only screen and (max-width: 600px) {
          .mobile-gif {
            width: 100% !important;
            height: 295px !important;
            border-radius: 32px !important;
            height: 100% !important;
          }
        }
        @media only screen and (max-width: 450px) {
          .mobile {
            padding: 0 10px !important;
          }
  
          .mobile_handpick {
            max-width: 370px !important;
            margin: 88px auto 0px auto !important;
            padding: 0px 10px !important;
          }
          .mobile_handpick_heading {
            font-size: 16px !important;
          }
          .mobile_handpick_detail {
            font-size: 12px !important;
          }
          .mobile_handpick_pick {
            width: 149px !important;
          }
          .mobille_hanpick_padding {
            padding: 0 10px !important;
          }
          .footer_text {
            font: 16px "Roboto" !important;
          }
          .main_heading {
            font-size: 25px !important;
          }
        }
      </style>
    </head>
  
    <body>
      <div style="background-color: #e5e5e5; margin: -8px">
        <div class="body">
          <div style="background-color: white">
            <table
              cellpadding="0"
              cellspacing="0"
              style="padding: 0 48px"
              class="mobile"
            >
              <tr>
                <td>
                  <div style="text-align: center; padding-top: 40px">
                    <img
                      style="margin-top: 30px"
                      src="https://firebasestorage.googleapis.com/v0/b/solarhub-44450.appspot.com/o/user%2FLogo%20(5).svg?alt=media&token=dafb5a6c-c92b-40be-ad22-a9c468db3c63"
                      alt=""
                    />
                    <img
                      style="margin-bottom: 11px; margin-left: 13px"
                      src="https://firebasestorage.googleapis.com/v0/b/solarhub-44450.appspot.com/o/user%2FSolarHub.svg?alt=media&token=2391c352-8b28-4ee2-b6a2-9476bad412e7"
                      alt=""
                    />
                  </div>
                  <div
                    style="
                      font-size: 36px;
                      font-weight: bold;
                      margin-top: 60px;
                      text-align: center;
                    "
                    class="main_heading"
                  >
                    Welcome to solarhub
                  </div>
                  <div
                    style="
                      margin-top: 50px;
                      text-align: center;
                      font: 19px 'Roboto';
                    "
                  >
                    ${fullNameUser} want to contact you for a conversation regarding the
                    solar project.
                  </div>
                  <img
                    style="
                      margin-top: 24px;
                      width: 304px;
                      height: 360px;
                      margin-left: 102px;
                      border-radius: 20px;
                    "
                    class="mobile-gif"
                    src="https://firebasestorage.googleapis.com/v0/b/solarhub-44450.appspot.com/o/user%2FHero.png?alt=media&token=653273e1-4cb0-46b8-b468-53f3b179b0ba"
                    alt=""
                  />
                  <div
                    style="
                      margin-top: 50px;
                      text-align: center;
                      font: 19px 'Roboto';
                    "
                  >
                    Please Click below if you either want to accept/ decline the
                    invitaion and visit the application to perform any action
                  </div>
                  <div
                    style="
                      text-align: center;
                      margin-top: 24px;
                      margin-bottom: 52px;
                    "
                  >
                  <a
                  href="${process.env.FRONTEND_URL}/notification"
                  target="_blank"
                  class="unsubscribe"
                  >
                    <button class="common-btn">Accept</button>
                    <button class="common-btn">Decline</button>
                  </div>
              </a>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </body>
  </html>  
  `,
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
