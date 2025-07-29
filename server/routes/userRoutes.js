import express from 'express';
import {syncUser, getUserData, applyForJob, getUserJobApplications, updateUserResume } from '../controllers/userController.js';
import upload from '../config/multer.js';
import { requireAuth } from '../middleware/authMiddleware.js';


const router = express.Router()

router.post('/sync', requireAuth, syncUser);

//Get user data
router.get('/user', requireAuth, getUserData)

//Apply for a job
router.post('/apply', requireAuth, applyForJob)

//Get applied jobs data
router.get('/applications', requireAuth, getUserJobApplications)

// Update user profile (resume)
router.post('/update-resume', requireAuth, upload.single('resume'), updateUserResume)

export default router;
