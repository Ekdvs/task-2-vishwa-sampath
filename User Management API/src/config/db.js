import mongoose from "mongoose"

const connectDB=async()=>{
    if(!process.env.MONGODB_URI){
        throw new Error('please defind MONGO_URl variabel inside the .env file')
    }
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfull connect to the database')
        
    }
    catch(error){
        console.error("Database Connection failed",error)
    }
}

export default connectDB;