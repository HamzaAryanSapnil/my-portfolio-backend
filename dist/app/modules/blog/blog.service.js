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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const blog_constant_1 = require("./blog.constant");
const client_1 = require("@prisma/client");
// adjust this import to your prisma client path:
const prisma = new client_1.PrismaClient();
/**
 * Helper: calculate pagination.
 * If you already have a pagination helper in your project, you can replace this.
 */
function calculatePagination(options) {
    var _a, _b, _c, _d;
    const page = Number((_a = options === null || options === void 0 ? void 0 : options.page) !== null && _a !== void 0 ? _a : 1);
    const limit = Number((_b = options === null || options === void 0 ? void 0 : options.limit) !== null && _b !== void 0 ? _b : 10);
    const skip = (page - 1) * limit;
    const sortBy = (_c = options === null || options === void 0 ? void 0 : options.sortBy) !== null && _c !== void 0 ? _c : "createdAt";
    const sortOrder = (_d = options === null || options === void 0 ? void 0 : options.sortOrder) !== null && _d !== void 0 ? _d : "desc";
    return { page, limit, skip, sortBy, sortOrder };
}
const getAllFromDb = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filters = {}, options = {}) {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const _a = filters, { searchTerm } = _a, filterData = __rest(_a, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: blog_constant_1.blogSearchableFields.map((field) => ({
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
                }
                else {
                    andConditions.push({
                        [key]: { equals: filterData[key] },
                    });
                }
            }
        });
    }
    const whereConditions = andConditions.length ? { AND: andConditions } : {};
    const [data, total] = yield Promise.all([
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
});
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma.blog.findUnique({ where: { id } });
    return blog;
});
const getBySlug = (slug) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield prisma.blog.findUnique({ where: { slug } });
    return blog;
});
const createBlog = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const created = yield prisma.blog.create({ data: payload });
    return created;
});
const updateBlog = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield prisma.blog.update({
        where: { id },
        data: payload,
    });
    return updated;
});
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield prisma.blog.delete({ where: { id } });
    return deleted;
});
exports.BlogService = {
    getAllFromDb,
    getById,
    getBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
};
