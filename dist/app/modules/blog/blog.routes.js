"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRoutes = void 0;
// modules/blog/blog.routes.ts
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// public list with filters & pagination
router.get("/", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.getAllFromDb);
// get by id
router.get("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.getSingleBlog);
// get by slug
router.get("/slug/:slug", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.getBlogBySlug);
// create (protected in real app)
router.post("/create-blog", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.createBlog);
// update
router.patch("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.updateBlog);
// delete
router.delete("/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), blog_controller_1.BlogController.deleteBlog);
exports.blogRoutes = router;
