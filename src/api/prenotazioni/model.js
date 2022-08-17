import mongoose from 'mongoose'

const prenotSchema = new mongoose.Schema({
    username: { type: String},
    lista: [{
        nome: { type: String},
        quantita: { type: Number, min: 1},

        }],
    pronto: {type: Boolean, default: false},
    ritirato: {type: Boolean, default: false},

});

export default mongoose.model('prenot', prenotSchema);
