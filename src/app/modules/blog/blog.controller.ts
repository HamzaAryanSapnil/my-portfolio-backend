// modules/blog/blog.controller.ts
import { Request, Response } from "express";

import { BlogService } from "./blog.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";


/**
 * GET /blogs
 * query: page, limit, sortBy, sortOrder, searchTerm, category, tags, authorId
 */
const getAllFromDb = catchAsync(async (req: Request, res: Response) => {
  const filters = {
    searchTerm: req.query.searchTerm as string | undefined,
    category: req.query.category as string | undefined,
    tags: req.query.tags
      ? Array.isArray(req.query.tags)
        ? req.query.tags
        : String(req.query.tags).split(",")
      : undefined,
    authorId: req.query.authorId as string | undefined,
  };

  const options = {
    page: typeof req.query.page === 'string' ? parseInt(req.query.page) : undefined,
    limit: typeof req.query.limit === 'string' ? parseInt(req.query.limit) : undefined,
    sortBy: typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined,
    sortOrder: typeof req.query.sortOrder === 'string' ? req.query.sortOrder : undefined,
  };

  const result = await BlogService.getAllFromDb(filters, options);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blogs retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

/**
 * GET /blogs/:id
 */
const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const blog = await BlogService.getById(id);
  if (!blog) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Blog not found",
      data: null,
    });
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog retrieved",
    data: blog,
  });
});

/**
 * GET /blogs/slug/:slug
 */
const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const blog = await BlogService.getBySlug(slug);
  if (!blog) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Blog not found",
      data: null,
    });
  }
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog retrieved",
    data: blog,
  });
});

/**
 * POST /blogs
 */
const createBlog = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const created = await BlogService.createBlog(payload);
  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: created,
  });
});

/**
 * PATCH /blogs/:id
 */
const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const existing = await BlogService.getById(id);
  if (!existing) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Blog not found",
      data: null,
    });
  }
  const updated = await BlogService.updateBlog(id, payload);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog updated successfully",
    data: updated,
  });
});

/**
 * DELETE /blogs/:id
 */
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const existing = await BlogService.getById(id);
  if (!existing) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Blog not found",
      data: null,
    });
  }
  await BlogService.deleteBlog(id);
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog deleted successfully",
    data: null,
  });
});

export const BlogController = {
  getAllFromDb,
  getSingleBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
