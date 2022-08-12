import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: { type: String },
    //ruolo: {type: String},

});

export default mongoose.model('User', userSchema);