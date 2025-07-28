import jwt from 'jsonwebtoken';
import Company from '../models/Company.js';
import { clerkClient, getAuth } from '@clerk/express';


export const protectCompany = async (req, res, next) => {

    const token = req.headers.token

    if (!token) {
        return res.json({ success: false, message: 'Not authorized, Login Again' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.company = await Company.findById(decoded.id).select('-password')

        next()

    } catch (error) {
        res.json({ success: false, message: error.message });


    }
}

export const requireAuth = async (req, res, next) => {

    try {
        const { userId } = getAuth(req); // Clerk extracts user ID from the token

        if (!userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const user = await clerkClient.users.getUser(userId);

        req.auth = { userId };
        req.user = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl
        };

        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.json({ success: false, message: "Auth failed" });
    }
};
