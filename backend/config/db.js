import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://mr-jawed:arsul74@cluster0.llu0l.mongodb.net/PIZZA')
    .then(()=>{
        console.log("DB connected");
    })
    

}

export {connectDB};