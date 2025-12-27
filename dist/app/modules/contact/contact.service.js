"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const sendContactEmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.emailSender.email,
            pass: config_1.default.emailSender.app_pass,
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
        yield transporter.sendMail({
            from: `"Contact Form" <${config_1.default.emailSender.email}>`,
            to: config_1.default.admin_email || config_1.default.emailSender.email, // Send to admin email
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
        yield transporter.sendMail({
            from: `"Hamza Aryan Sapnil" <${config_1.default.emailSender.email}>`,
            to: data.email,
            subject: "Thank you for contacting us!",
            html: userEmailHtml,
        });
        return { success: true };
    }
    catch (error) {
        console.error("Email sending error:", error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to send email");
    }
});
exports.ContactService = {
    sendContactEmail,
};
