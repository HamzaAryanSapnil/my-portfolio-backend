import express from "express";
import { ContactController } from "./contact.controller";
import validateRequest from "../../middlewares/validateRequest";
import contactFormSchema from "./contact.validation";

const router = express.Router();

// Public route - no authentication required
router.post(
  "/submit",
  validateRequest(contactFormSchema),
  ContactController.submitContactForm
);

export const contactRoutes = router;

