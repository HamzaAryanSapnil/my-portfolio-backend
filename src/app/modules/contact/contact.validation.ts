import { z } from "zod";

const contactFormSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(3, "Subject must be at least 3 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
  }),
});

export default contactFormSchema;

