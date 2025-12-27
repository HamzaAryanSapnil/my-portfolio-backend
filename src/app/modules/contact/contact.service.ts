import nodemailer from "nodemailer";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

const sendContactEmail = async (data: ContactFormData) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Email to admin/developer
    const adminEmailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
    `;

    await transporter.sendMail({
      from: `"Contact Form" <${config.emailSender.email}>`,
      to: config.admin_email || config.emailSender.email, // Send to admin email
      subject: `New Contact Form Submission: ${data.subject}`,
      html: adminEmailHtml,
    });

    // Optional: Send confirmation email to user
    const userEmailHtml = `
      <h2>Thank you for reaching out!</h2>
      <p>Hi ${data.name},</p>
      <p>We've received your message and will get back to you soon.</p>
      <p><strong>Your message:</strong></p>
      <p>${data.message.replace(/\n/g, "<br>")}</p>
      <p>Best regards,<br>Hamza Aryan Sapnil</p>
    `;

    await transporter.sendMail({
      from: `"Hamza Aryan Sapnil" <${config.emailSender.email}>`,
      to: data.email,
      subject: "Thank you for contacting us!",
      html: userEmailHtml,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email sending error:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email"
    );
  }
};

export const ContactService = {
  sendContactEmail,
};

