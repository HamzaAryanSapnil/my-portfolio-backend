// modules/blog/blog.routes.ts
import express from "express";
import { BlogController } from "./blog.controller";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";

const router = express.Router();

// public list with filters & pagination
router.get("/",  BlogController.getAllFromDb);

// get by id
// router.get("/:id",  BlogController.getSingleBlog);

// get by slug
router.get("/:slug",  BlogController.getBlogBySlug);

// create (protected in real app)
router.post("/create-blog", auth(UserRole.ADMIN), BlogController.createBlog);

// update
router.patch("/:id", auth(UserRole.ADMIN), BlogController.updateBlog);

// delete
router.delete("/:id", auth(UserRole.ADMIN), BlogController.deleteBlog);

export const blogRoutes = router;
