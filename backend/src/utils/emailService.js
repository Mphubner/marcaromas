import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, text, html }) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured, skipping email send");
    return;
  }
  await transporter.sendMail({
    from: `"Marc Aromas" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}
