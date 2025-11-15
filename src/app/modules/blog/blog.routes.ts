// modules/blog/blog.routes.ts
import express from "express";
import { BlogController } from "./blog.controller";

const router = express.Router();

// public list with filters & pagination
router.get("/", BlogController.getAllFromDb);

// get by id
router.get("/:id", BlogController.getSingleBlog);

// get by slug
router.get("/slug/:slug", BlogController.getBlogBySlug);

// create (protected in real app)
router.post("/", BlogController.createBlog);

// update
router.patch("/:id", BlogController.updateBlog);

// delete
router.delete("/:id", BlogController.deleteBlog);

export const blogRoutes = router;
