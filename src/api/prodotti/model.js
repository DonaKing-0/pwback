import mongoose from 'mongoose'

const prodSchema = new mongoose.Schema({
    nome: { type: String, unique: true, required: true},//univoco

    img: { type: String },

    disponibile: {type: Boolean, default: false},
    quantita: {type: Number, min: 0, default: 0},
    unitamisura: { type: String },

    prezzo: {type: Number, min: 0, default: 0},

    offerta: {type: Boolean, default: false},

    categoria: { type: String },
    stagione: { type: String}
                                            //enum: ["a","b"]     si può fare con array
                                                    // variabile nel db?

});

export default mongoose.model('Prodotti', prodSchema);