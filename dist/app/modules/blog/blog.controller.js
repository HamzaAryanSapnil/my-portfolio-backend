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
exports.BlogController = void 0;
const blog_service_1 = require("./blog.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
/**
 * GET /blogs
 * query: page, limit, sortBy, sortOrder, searchTerm, category, tags, authorId
 */
const getAllFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        searchTerm: req.query.searchTerm,
        category: req.query.category,
        tags: req.query.tags
            ? Array.isArray(req.query.tags)
                ? req.query.tags
                : String(req.query.tags).split(",")
            : undefined,
        authorId: req.query.authorId,
    };
    const options = {
        page: typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined,
        limit: typeof req.query.limit === 'string' ? parseInt(req.query.limit) : undefined,
        sortBy: typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined,
        sortOrder: typeof req.query.sortOrder === 'string' ? req.query.sortOrder : undefined,
    };
    const result = yield blog_service_1.BlogService.getAllFromDb(filters, options);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blogs retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
}));
/**
 * GET /blogs/:id
 */
const getSingleBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const blog = yield blog_service_1.BlogService.getById(id);
    if (!blog) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Blog not found",
            data: null,
        });
    }
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved",
        data: blog,
    });
}));
/**
 * GET /blogs/slug/:slug
 */
const getBlogBySlug = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const blog = yield blog_service_1.BlogService.getBySlug(slug);
    if (!blog) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Blog not found",
            data: null,
        });
    }
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog retrieved",
        data: blog,
    });
}));
/**
 * POST /blogs
 */
const createBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const created = yield blog_service_1.BlogService.createBlog(payload);
    return (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blog created successfully",
        data: created,
    });
}));
/**
 * PATCH /blogs/:id
 */
const updateBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const existing = yield blog_service_1.BlogService.getById(id);
    if (!existing) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Blog not found",
            data: null,
        });
    }
    const updated = yield blog_service_1.BlogService.updateBlog(id, payload);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog updated successfully",
        data: updated,
    });
}));
/**
 * DELETE /blogs/:id
 */
const deleteBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const existing = yield blog_service_1.BlogService.getById(id);
    if (!existing) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 404,
            success: false,
            message: "Blog not found",
            data: null,
        });
    }
    yield blog_service_1.BlogService.deleteBlog(id);
    return (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Blog deleted successfully",
        data: null,
    });
}));
exports.BlogController = {
    getAllFromDb,
    getSingleBlog,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
};
