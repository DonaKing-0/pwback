import mongoose from 'mongoose'

const prenotSchema = new mongoose.Schema({
    username: { type: String},
    lista: [{
        nome: { type: String},
        quantita: { type: Number, min: 1},

        }],
    //data----->ora
    //ecc
    pronto: {type: Boolean, default: false},
    ritirato: {type: Boolean, default: false},

});

export default mongoose.model('prenot', prenotSchema);

//postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

//var  User = mongoose.model('User') 
