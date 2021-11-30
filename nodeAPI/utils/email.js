const mailer = require("nodemailer");
// require("dotenv").config();

const sendEmail = async (options) => {
    // 1. Create Transporter

    const transporter = mailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    console.log(transporter);

    // 2. Email options
    const mailOption = {
        from: "Parvez Vantiya<parvezvantiya@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html
    };

    // 3. Send email with nodemailer
    await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
