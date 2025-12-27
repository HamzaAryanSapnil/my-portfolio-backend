"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const contactFormSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
        phone: zod_1.z.string().min(10, "Phone number must be at least 10 characters"),
        email: zod_1.z.string().email("Invalid email address"),
        subject: zod_1.z.string().min(3, "Subject must be at least 3 characters"),
        message: zod_1.z.string().min(10, "Message must be at least 10 characters"),
    }),
});
exports.default = contactFormSchema;
