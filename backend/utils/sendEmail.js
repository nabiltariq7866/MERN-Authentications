import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      service: process.env.SMTP_SERVICES,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_MAIL,
      to: email,
      subject: subject,
      html: message,
    });

    console.log("✅ Message sent:", info.messageId);
    return info;

  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error("Email could not be sent");
  }
};
