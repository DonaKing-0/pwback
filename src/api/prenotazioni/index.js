import _ from 'lodash'
import { Router } from 'express';
import userjwt from '../../services/jwt/index.js'
import prenotmodel from "./model.js";
import usersmodel from '../users/model.js';
import adminjwt from '../../services/jwt/indexadmin.js'
import prodSchema from '../prodotti/model.js'

const router = new Router();

import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId
  // object id valido
  function isValidObjectId(id){
    if(ObjectId.isValid(id)){
      if((String)(new ObjectId(id)) === id){
        return true;	
      }
      return false;
    }
    return false;
  }


  //ordine non modificabile
  //solo cambio pronto/nn pronto  admin


//lista prenotaz
//admin
router.get("/", adminjwt, async function (request, response) {
  const lista = await prenotmodel.find();
  return response.json(lista);
});

//lista proprie prenot
//non admin
router.get("/user", userjwt, async function (request, response) {

  //ordini di user
  const u= await usersmodel.findOne({ _id: request.decoded.user.id });

  const lista = await prenotmodel.find({ username: u.username });               //vero json
  return response.json(lista);
});

//singolo ordine non serve?

//nuova prenot 
//non admin
router.post("/", userjwt, async function (request, response) {

  //username obbligat e esistente ma se passa jwt x forza
  const user= await usersmodel.findOne({ _id: request.decoded.user.id });

  //almeno 1 prodotto ->esistente   //controlla ci sia
  //almeno 1 e se +?

  if(request.body.prodotti!=undefined && typeof request.body.prodotti=='object'){
    //controlla se array o solo un ogg
    //se array ok         //se 1 solo metti in array ---->stesso trattamento
    if(request.body.prodotti.length==undefined){
      request.body.prodotti=[request.body.prodotti];
    }

    const prodotti= request.body.prodotti;
console.log(prodotti)
    const msg=[];

    //ogni prod - se nome esiste - se ha quantita valida
    const prodott= await prodotti.reduce(async(ris, p) => {//con async non funziona non filtra -->

      const prod= await prodSchema.findOne({ nome: p.nome });
      console.log(prod)
      console.log(ris)
      if(prod && p.quantita && p.quantita>0){//controlla sia numero?

        if(prod.quantita==undefined){
          prod.quantita=0;             //non dovrebbe servire?
        }
        if(prod.quantita-p.quantita>=0){
          const el={
            "quantita": prod.quantita-p.quantita,
            //"disponibile": true//se = 0 non è disponibile!!!!!!!!!!!!!!!!!!!!!1
          }

          if(prod.quantita-p.quantita==0){
            el.disponibile=false;
          }else{
            el.disponibile=true;
          }

          console.log(el);
          prod.set(el);
          await prod.save();

          return (await ris).concat(p);
  
        }else{
          msg.push(prod.nome+" qta non disponibile")
          return ris;
        }
      }else{
        return ris;
      }
    },[]);
    console.log(msg)
    console.log("filtrati")
console.log(prodott)
    //se alla fine resta qualcosa ok altrim inserisci validi
    if(prodott.length!=0){

      //torna a oggetto con anche nome dal user.username
      const prenotaz={
        username: user.username,
        lista: prodott,
        msg: msg
      }
      console.log(prenotaz)

      await prenotmodel.create(prenotaz);
      response.json(prenotaz);//??

    }else{
      response.send("inserire prodotti/o validi/o "+msg);
    }
  }else{
    response.send("inserire prodotti/o");
  }
});

//mod pronto
// admin
router.put("/pronto/:id", adminjwt, async function (request, response) {
  if(isValidObjectId(request.params.id)){

      const trovato = (await prenotmodel.find({ _id: request.params.id }))[0];

      if(trovato){  
        const el= _.pick(request.body, ['pronto']);//controlla che ci sia

        const fin = await prenotmodel.findByIdAndUpdate(trovato._id , el);//restituisce il vecchio
        
        if (fin.length === 0) {//non c'e' piu
          response.sendStatus(404);
        } else {
          response.json(_.omit(fin.toJSON(), ['__v', '_id']));
        }
      }else{
        response.sendStatus(404);
      }
  }else{
    console.log("not valid MongodbID");
    response.send("not valid MongodbID");
  }
});

//mod ritirato
// admin
router.put("/ritir/:id", adminjwt, async function (request, response) {
  if(isValidObjectId(request.params.id)){

      const trovato = (await prenotmodel.find({ _id: request.params.id }))[0];

      if(trovato){ 
        const el= _.pick(request.body, ['ritirato']);//se non c'è?

        const fin = await prenotmodel.findByIdAndUpdate(trovato._id , el);
        
        if (fin.length === 0) {//non c'e' piu
          response.sendStatus(404);
        } else {
          response.json(_.omit(fin.toJSON(), ['__v', '_id']));
        }
      }else{
        response.sendStatus(404);
      }
  }else{
    console.log("not valid MongodbID");
    response.send("not valid MongodbID");
  }
});


//elimin per id   
//non admin
router.delete("/:id", userjwt, async function (request, response) {

  if(isValidObjectId(request.params.id)){

  //riaggiungi quantita x ogni prodotto
  const pre=await prenotmodel.findOne({ _id: request.params.id });
  const user= await usersmodel.findOne({ _id: request.decoded.user.id });
    if(pre && pre.username==user.username){
      
      //cancellare solo prorpie prenotaz!
      //controlla uente e username =====

      pre.lista.forEach(async (e) => {
        
        const element = await prodSchema.findOne({ nome: e.nome });
        if (element) {//magari cancellato nel frattemppo -->non fare nulla
          //x scontato che quantita ci sia e ok
            if(element.quantita==undefined){
              element.quantita=0;             //non dovrebbe servire?
            }
            const el={
              "quantita": element.quantita+e.quantita,
              "disponibile": true
            }
            
            console.log(el);
            element.set(el);
            await element.save();
        }
      });

      const elim= await prenotmodel.findByIdAndDelete(request.params.id);//controlli sull elimina
      console.log(elim);
      return response.sendStatus(204);
        
    }else{
      return response.sendStatus(401);
    }
}else{
  console.log("not valid MongodbID");
  response.send("not valid MongodbID");
}
});

export default router;