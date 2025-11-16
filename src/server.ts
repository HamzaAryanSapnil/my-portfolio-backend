// import { Server } from 'http';
// import app from './app';
// import config from './config';


// async function bootstrap() {
//     // This variable will hold our server instance
//     let server: Server;

//     try {
//         // Start the server
//         server = app.listen(config.port, () => {
//             console.log(`🚀 Server is running on http://localhost:${config.port}`);
//         });

//         // Function to gracefully shut down the server
//         const exitHandler = () => {
//             if (server) {
//                 server.close(() => {
//                     console.log('Server closed gracefully.');
//                     process.exit(1); // Exit with a failure code
//                 });
//             } else {
//                 process.exit(1);
//             }
//         };

//         // Handle unhandled promise rejections
//         process.on('unhandledRejection', (error) => {
//             console.log('Unhandled Rejection is detected, we are closing our server...');
//             if (server) {
//                 server.close(() => {
//                     console.log(error);
//                     process.exit(1);
//                 });
//             } else {
//                 process.exit(1);
//             }
//         });
//     } catch (error) {
//         console.error('Error during server startup:', error);
//         process.exit(1);
//     }
// }

// bootstrap();
import app from "./app";
import config from "./config";

/**
 * If running on Vercel Serverless, there is NO app.listen()
 * Vercel will automatically handle the request using the exported app.
 */

// If NOT running on Vercel (local dev), then start the server normally
if (process.env.VERCEL !== "1") {
  const server = app.listen(config.port, () => {
    console.log(`🚀 Server running locally on http://localhost:${config.port}`);
  });

  const exitHandler = () => {
    console.log("🛑 Server shutting down...");
    server.close(() => {
      process.exit(1);
    });
  };

  process.on("SIGINT", exitHandler);
  process.on("SIGTERM", exitHandler);

  process.on("unhandledRejection", (error) => {
    console.log("❌ Unhandled Rejection detected...");
    console.log(error);
    exitHandler();
  });
}

// Export for Vercel serverless function
export default app;
