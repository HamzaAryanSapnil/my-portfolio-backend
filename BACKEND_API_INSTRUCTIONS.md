# Contact Form API Implementation Instructions

## Overview
This document provides instructions for implementing the backend API endpoint for the contact form submission. The frontend sends contact form data to the backend, which should then send an email notification using Resend.

## API Endpoint

### POST `/contact/submit`

**Request Body:**
```json
{
  "name": "string (min 2 characters)",
  "phone": "string (min 10 characters)",
  "email": "string (valid email)",
  "subject": "string (min 3 characters)",
  "message": "string (min 10 characters)"
}
```

**Request Headers:**
```
Content-Type: application/json
```

## Expected Response

### Success Response (200)
```json
{
  "success": true,
  "message": "Contact form submitted successfully. We'll get back to you soon!"
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "message": "Error message here",
  "errors": {
    "fieldName": ["Error message for this field"]
  }
}
```

## Implementation Steps

### 1. Create Contact Form Route

Create a new route file: `routes/contact.routes.ts` (or add to existing routes)

```typescript
import express from 'express';
import { submitContactForm } from '../controllers/contact.controller';
import { validateContactForm } from '../middleware/contact.validation';

const router = express.Router();

router.post('/submit', validateContactForm, submitContactForm);

export default router;
```

### 2. Create Contact Controller

Create: `controllers/contact.controller.ts`

```typescript
import { Request, Response } from 'express';
import { sendContactEmail } from '../services/email.service';

export const submitContactForm = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    // Send email using Resend
    await sendContactEmail({
      name,
      phone,
      email,
      subject,
      message,
    });

    return res.status(200).json({
      success: true,
      message: "Contact form submitted successfully. We'll get back to you soon!",
    });
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to submit contact form. Please try again.",
    });
  }
};
```

### 3. Create Validation Middleware

Create: `middleware/contact.validation.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const validateContactForm = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    contactFormSchema.parse(req.body);
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(err.message);
      });

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request data",
    });
  }
};
```

### 4. Create Email Service

Create: `services/email.service.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactFormData) => {
  try {
    // Email to developer/admin
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL || 'hamzaswapnil@gmail.com',
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Optional: Send confirmation email to user
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: data.email,
      subject: 'Thank you for contacting us!',
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${data.name},</p>
        <p>We've received your message and will get back to you soon.</p>
        <p><strong>Your message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
        <p>Best regards,<br>Hamza Aryan Sapnil</p>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send email');
  }
};
```

### 5. Environment Variables

Add to your `.env` file:

```env
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
CONTACT_EMAIL=hamzaswapnil@gmail.com
```

### 6. Install Dependencies

```bash
npm install resend zod
# or
yarn add resend zod
```

### 7. Register Route in Main App

In your main `app.ts` or `server.ts`:

```typescript
import contactRoutes from './routes/contact.routes';

// ... other routes
app.use('/contact', contactRoutes);
```

## Testing

### Using cURL

```bash
curl -X POST http://localhost:5000/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "1234567890",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I would like to discuss a potential project."
  }'
```

### Using Postman

1. Method: POST
2. URL: `http://localhost:5000/contact/submit`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I would like to discuss a potential project."
}
```

## Notes

1. **Resend Setup**: Make sure you have a Resend account and API key. Sign up at https://resend.com
2. **Email Domain**: For production, configure your domain in Resend and use a verified email address
3. **Error Handling**: Ensure proper error handling for email failures
4. **Rate Limiting**: Consider adding rate limiting to prevent spam
5. **CORS**: Make sure CORS is properly configured to allow requests from your frontend domain

## Frontend Integration

The frontend is already configured to:
- Send POST requests to `/contact/submit`
- Handle success/error responses
- Display toast notifications
- Validate form fields client-side

You just need to implement the backend endpoint as described above.

