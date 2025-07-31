import './config/instrument.js'
import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express'

//Initialize Express
const app = express();

//Connect to database
//await connectDB()
// await connectCloudinary();

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'https://pro-hire-new1-client.vercel.app'],
    credentials: true
}));

// Fix CORS preflight issues (especially for Vercel frontend)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://pro-hire-new1-client.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


app.use(express.json());
app.use(clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY
}))

// Routes
app.get('/', (req, res) => res.send("API Working"))
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.post('/webhooks', clerkWebhooks)
app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes);


//port
const PORT = process.env.PORT || 5000;

// Sentry.setupExpressErrorHandler(app);

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })
// Connect DB and start server
(async () => {
    try {
        await connectDB();
        await connectCloudinary();
        Sentry.setupExpressErrorHandler(app);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
})();

export default app;