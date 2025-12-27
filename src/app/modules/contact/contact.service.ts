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
  // Check if config values are available
  if (!config.emailSender.email || !config.emailSender.app_pass) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Email configuration is missing"
    );
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass, // app password
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

    const adminEmail = config.admin_email || config.emailSender.email;

    await transporter.sendMail({
      from: config.emailSender.email, // sender address
      to: adminEmail, // list of receivers
      subject: `New Contact Form Submission: ${data.subject}`, // Subject line
      html: adminEmailHtml, // html body
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
      from: config.emailSender.email, // sender address
      to: data.email, // list of receivers
      subject: "Thank you for contacting us!", // Subject line
      html: userEmailHtml, // html body
    });

    return { success: true };
  } catch (error: any) {
    console.error("Email sending error:", error);
    console.error("Config check:", {
      email: config.emailSender.email ? "SET" : "NOT SET",
      app_pass: config.emailSender.app_pass ? "SET" : "NOT SET",
    });
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to send email"
    );
  }
};

export const ContactService = {
  sendContactEmail,
};

