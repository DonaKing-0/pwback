import mongoose from 'mongoose'
import altroSchema from '../altro/model.js'
/* //rimangono undefined
console.log(await altroSchema.findOne().stagioni)
const a= await altroSchema.findOne().stagioni;
console.log('a')
console.log(a)*/


const prodSchema = new mongoose.Schema({
    nome: { type: String, unique: true, required: true},//univoco

    img: { type: String },

    disponibile: {type: Boolean, default: false},
    quantita: {type: Number, min: 0, default: 0},
    unitamisura: { type: String },

    offerta: {type: Boolean, default: false},

    categoria: { type: String },
    stagione: { type: String}
                                            //enum: ["a","b"]     si può fare con array
                                                    // variabile nel db?

});

export default mongoose.model('Prodotti', prodSchema);

/*
entita

stagioni        ...
categorie       ...
unitamisura     ...

*/

//urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;