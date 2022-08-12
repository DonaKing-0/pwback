import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    usernameadmin: { type: String, unique: true },
    passwordadmin: { type: String },
    //ruolo: {type: String},
    
});

export default mongoose.model('admin', adminSchema);