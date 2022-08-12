import mongoose from 'mongoose'

const altroSchema = new mongoose.Schema({
    stagioni: [{ type: String, unique: true, default: []}],
    categorie: [{ type: String, unique: true, default: []}],
    unitamisura: [{ type: String, unique: true, default: []}],

});

export default mongoose.model('altro', altroSchema);

/*
entita

stagioni        ...
categorie       ...
unitamisura     ...

*/

//urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;