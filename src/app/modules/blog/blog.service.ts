// modules/blog/blog.service.ts
import { IBlog, IBlogFilters, IOptions } from "./blog.interface";
import { blogSearchableFields } from "./blog.constant";
import { PrismaClient } from "@prisma/client";
// adjust this import to your prisma client path:

const prisma = new PrismaClient();
/**
 * Helper: calculate pagination.
 * If you already have a pagination helper in your project, you can replace this.
 */
function calculatePagination(options: IOptions) {
  const page = Number(options?.page ?? 1);
  const limit = Number(options?.limit ?? 10);
  const skip = (page - 1) * limit;
  const sortBy = options?.sortBy ?? "createdAt";
  const sortOrder = (options?.sortOrder as "asc" | "desc") ?? "desc";
  return { page, limit, skip, sortBy, sortOrder };
}

const getAllFromDb = async (
  filters: IBlogFilters = {},
  options: IOptions = {}
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const { searchTerm, ...filterData } = filters as any;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: blogSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (filterData && Object.keys(filterData).length) {
    Object.keys(filterData).forEach((key) => {
      if (filterData[key] !== undefined) {
        // handle tags (array) specially if needed
        if (key === "tags" && Array.isArray(filterData[key])) {
          andConditions.push({
            tags: { hasEvery: filterData[key] },
          });
        } else {
          andConditions.push({
            [key]: { equals: filterData[key] },
          });
        }
      }
    });
  }

  const whereConditions = andConditions.length ? { AND: andConditions } : {};

  const [data, total] = await Promise.all([
    prisma.blog.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
    }),
    prisma.blog.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

const getById = async (id: string) => {
  const blog = await prisma.blog.findUnique({ where: { id } });
  return blog;
};

const getBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({ where: { slug } });
  return blog;
};

const createBlog = async (payload: any) => {

  const created = await prisma.blog.create({ data: payload as any });
  return created;
};

const updateBlog = async (id: string, payload: Partial<IBlog>) => {
  const updated = await prisma.blog.update({
    where: { id },
    data: payload as any,
  });
  return updated;
};

const deleteBlog = async (id: string) => {
  const deleted = await prisma.blog.delete({ where: { id } });
  return deleted;
};

export const BlogService = {
  getAllFromDb,
  getById,
  getBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
