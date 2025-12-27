import express from 'express';
import { blogRoutes } from '../modules/blog/blog.routes';
import { authRoutes } from '../modules/auth/auth.route';
import { contactRoutes } from '../modules/contact/contact.routes';


const router = express.Router();

const moduleRoutes = [
  {
    path: "/blogs",
    route: blogRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/contact",
    route: contactRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;