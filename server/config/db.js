import mongoose from "mongoose";

//Function to connect to MongoDB database
const connectDB = async () => {

    // mongoose.connection.on("connected", () => console.log('Database Connected'))

    // await mongoose.connect(`${process.env.MONGODB_URI}` )

    // mongoose.connection.on("connected", () => console.log('Database Connected'));

    // try {
    //     await mongoose.connect(process.env.MONGODB_URI, {
    //         useNewUrlParser: true,
    //         useUnifiedTopology: true
    //     });
    // } catch (error) {
    //     console.error("MongoDB connection failed:", error.message);
    //     process.exit(1); // Optional: exit app on DB failure
    // }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected'); 
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
}


export default connectDB;
