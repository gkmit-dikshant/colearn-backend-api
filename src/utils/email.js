const path = require("path");
const ejs = require("ejs");
const nodemailer = require("nodemailer");

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailPass) {
  throw new Error("email password is not present");
} else if (!emailUser) {
  throw new Error("email user is not present");
}

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
  }
  async send(to, subject, template, data) {
    const templatePath = path.join(process.cwd(), "src", "views", `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, data);
    const info = await this.transporter.sendMail({
      from: `"CoLearn" <${emailUser}>`,
      to,
      subject,
      html,
    });

    console.log("Message sent:", info.messageId);
  }
}

module.exports = Email;
