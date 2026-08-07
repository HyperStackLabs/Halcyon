import mongoose from 'mongoose'

export async function connectDB(){
    try{
        const dbURL = process.env.DB_URL
        if(!dbURL){
            throw new Error("DATABASE URL ISN'T THERE")
        }
        await mongoose.connect(dbURL)
        console.log('Successfully connected to the database!')
    }catch(error){
        throw error
        process.exit(1)
    }
}