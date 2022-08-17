import mongoose from 'mongoose'

const altroSchema = new mongoose.Schema({
    stagioni: [{ type: String, unique: true, default: []}],
    categorie: [{ type: String, unique: true, default: []}],
    unitamisura: [{ type: String, unique: true, default: []}],

});

export default mongoose.model('altro', altroSchema);