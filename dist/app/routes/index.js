"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_routes_1 = require("../modules/blog/blog.routes");
const auth_route_1 = require("../modules/auth/auth.route");
const contact_routes_1 = require("../modules/contact/contact.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/blogs",
        route: blog_routes_1.blogRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.authRoutes,
    },
    {
        path: "/contact",
        route: contact_routes_1.contactRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
