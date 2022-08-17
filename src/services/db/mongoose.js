import mongoose from 'mongoose';
import 'dotenv/config'

export default async function init() {
    try {
        console.log("Connecting to mongoose...")
        await mongoose.connect(process.env.mongo);
        console.log("Mongose connected.")
                                        // nome db projectwork
    } catch (e) {
        console.error(e)
    }
}