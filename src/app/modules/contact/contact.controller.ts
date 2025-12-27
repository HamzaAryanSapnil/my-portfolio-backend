import { Request, Response } from "express";
import { ContactService } from "./contact.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";

/**
 * POST /contact/submit
 */
const submitContactForm = catchAsync(
  async (req: Request, res: Response) => {
    const { name, phone, email, subject, message } = req.body;

    await ContactService.sendContactEmail({
      name,
      phone,
      email,
      subject,
      message,
    });

    return sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Contact form submitted successfully. We'll get back to you soon!",
      data: null,
    });
  }
);

export const ContactController = {
  submitContactForm,
};

