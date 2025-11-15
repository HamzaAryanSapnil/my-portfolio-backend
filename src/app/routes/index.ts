import express from 'express';
import { blogRoutes } from '../modules/blog/blog.routes';


const router = express.Router();

const moduleRoutes = [
  {
    path: "/blogs",
    route: blogRoutes,
  },
//   {
//     path: "/auth",
//     route: authRoutes,
//   },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;