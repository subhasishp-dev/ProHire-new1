import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { v2 as cloudinary } from 'cloudinary';


// Create user in DB if not exists (after login)
export const syncUser = async (req, res) => {
    const { userId } = req.auth;
    const { firstName, lastName, email, imageUrl } = req.user;

    console.log("Syncing user:", { userId, firstName, lastName, email });


    try {
        let user = await User.findById(userId);

         if (!user) {
            user = await User.findOne({ email });

            if (user) {
                user._id = userId; // update _id to Clerk's ID
                await user.save();
            }
        }

        if (!user) {
            // Create new user in DB
            user = await User.create({
                _id: userId, // Clerk userId is used as _id
                name: `${firstName} ${lastName}`,
                email,
                image: imageUrl || "",
                role: "candidate" // or "recruiter", set based on your logic
            });
            console.log("New user created in MongoDB:", user.email);
        }

        res.json({ success: true, message: "User synced successfully", user });
    } catch (error) {
        console.error("Error syncing user:", error.message);
        res.json({ success: false, message: error.message });
    }
};


//Get user data
export const getUserData = async (req, res) => {

    const userId = req.auth.userId;
    
    try {

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message });

    }

}


// export const getUserData = async (req, res) => {
//     const token = req.headers.token;

//     if (!token) {
//         return res.json({ success: false, message: 'Not authorized, login again' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.id;

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.json({ success: false, message: 'User not found' });
//         }

//         res.json({ success: true, user });

//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };


//Apply for a job
export const applyForJob = async (req, res) => {

    const { jobId } = req.body;
    
    const userId = req.auth.userId;

    // const token = req.headers.token;
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;


    try {

        const isAlreadyApplied = await JobApplication.find({ jobId, userId })

        if (isAlreadyApplied.length > 0) {
            return res.json({ success: false, message: 'Already Applied' });
        }

        const jobData = await Job.findById(jobId)

        if (!jobData) {
            return res.json({ success: false, message: 'Job not found' });
        }

        await JobApplication.create({
            jobId,
            userId,
            companyId: jobData.companyId,
            date: Date.now()
        })

        res.json({ success: true, message: 'Applied successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

//Get user applied applications
export const getUserJobApplications = async (req, res) => {

    try {

        const userId = req.auth.userId;

        // const token = req.headers.token;
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decoded.id;


        const applications = await JobApplication.find({ userId })
            .populate('companyId', 'name email image')
            .populate('jobId', 'title description location salary category level')
            .exec()

        if (!applications) {
            return res.json({ success: false, message: 'No applications found for this user.' })
        }

        return res.json({ success: true, applications });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}

// update user profile (resume)
export const updateUserResume = async (req, res) => {

    try {

        const userId = req.auth.userId

        // const token = req.headers.token;
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decoded.id;


        const resumeFile = req.file

        const userData = await User.findById(userId)

        if (resumeFile) {
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            userData.resume = resumeUpload.secure_url;
        }

        await userData.save();

        return res.json({ success: true, message: 'Resume updated successfully' });



    } catch (error) {

        res.json({ success: false, message: error.message });
    }

}