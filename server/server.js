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
await connectCloudinary();

// Use this configuration:
const allowedOrigins = ['http://localhost:5173','https://pro-hire-new1-client.vercel.app/'];



// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true, // if using cookies or auth headers
}));
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
app.use('/api/user', userRoutes);


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
        Sentry.setupExpressErrorHandler(app);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
})();
