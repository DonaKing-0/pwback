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
  const lista = await prenotmodel.find();               //vero json
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

//utente per id
//non admin
/*router.get("/id/:id", userjwt, async function (request, response) {


  //controlla sia user giusto 


console.log(request.params)
  //valida id...
  if(isValidObjectId(request.params.id)){

    //id deve essere uguale sia in params che nel token
    if(request.decoded.user.id.toString()==request.params.id){

      const element = await usersmodel.findOne({ _id: request.params.id });
      console.log(element)
      return element ? response.json(_.omit(element, ['__v', '_id'])) : response.sendStatus(404);
    /*  if (element.length === 0) {
        response.sendStatus(404);
      } else {
        //element array
        const e = element[0].toJSON();
        response.json(_.omit(e, ['__v', 'password']));
      }
      //return element ? response.json(_.omit(element, 'password')) : response.sendStatus(404);
    */
    /*}else{
      response.sendStatus(401);
    }
  }else{
    console.log("not valid MongodbID");
    response.send("not valid MongodbID");
}
});*/

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
      request.body.prodotti=[request.body.prodotti];//controlla
    }

    const prodotti= request.body.prodotti;
console.log(prodotti)
    const msg=[];

    //ogni prod - se nome esiste - se ha quantita valida
    const prodott= await prodotti.reduce(async(ris, p) => {//con async non funziona non filtra -->
      //correggi anche altre
      //reduce ma restituisce un solo risultato 
      //push solo prod ok 
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

          return (await ris).concat(p);//xke concat?
  
          //return element ? response.json(element) : response.sendStatus(404);
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
console.log(prodott)//1?! non torna l accumulatore?
    //se alla fine resta qualcosa ok altrim inserisci validi
    if(prodott.length!=0){

      //se + volte lo stesso prodotto?    -->somma?
      //ordinam
      //posto 1 nome = posto 2 nome 
      //no avanti   i++ j++
      //si somma qta e elimina quello in posto 2 no i++
/*      function SortArray(x, y){
          if (x.nome < y.nome) {return -1;}
          if (x.nome > y.nome) {return 1;}
          return 0;
      }
      var s = prodotti.sort(SortArray);*/


//+facile quando aggiunto prodotto in front -->se c'è già sommo qta 
//non agg prod



            //x ogni prod togli qta da prodotto --> si puo chiamare altra route???
//sott qta 
/*prodott.forEach(async (e) =>{


    const element = await prodSchema.findOne({ nome: e.nome });
    if (element) {
      //if(request.body.sottqta!=undefined && typeof request.body.sottqta == 'number' && request.body.sottqta>0){   //controllare se non è numero
        if(element.quantita==undefined){
          element.quantita=0;             //non dovrebbe servire?
        }

        if(element.quantita-e.quantita>=0){
          const el={
            "quantita": element.quantita-e.quantita,
            "disponibile": true//se = 0 non è disponibile!!!!!!!!!!!!!!!!!!!!!1
          }
          console.log(el);
          element.set(el);
          await element.save();
  
          //return element ? response.json(element) : response.sendStatus(404);
        }else{
          msg.push(element.nome+" qta non disponibile")
        }
      /*}else{
        response.send("qta non valida");
      }*/
    //}/*else{
   //   response.sendStatus(404);
    //}*/
  /*}else{
    response.sendStatus(401);
  }*/
/*});*/

      //torna a oggetto con anche nome dal user.username
      const prenotaz={
        username: user.username,
        lista: prodott,
        msg: msg
      }
      console.log(prenotaz)
      //crea salva manda msg


//controlla se rimasto qualcosa dopo controllo quantita!  --> da fare sopra? nel reduce


      await prenotmodel.create(prenotaz);
      response.json(prenotaz);//??

    }else{
      response.send("inserire prodotti/o validi/o "+msg);
    }
  }else{
    response.send("inserire prodotti/o");
  }

  /*const user = new usersmodel({
    username: request.body.username,
  });*/
});

//mod pronto
// admin
router.put("/pronto/:id", adminjwt, async function (request, response) {
  if(isValidObjectId(request.params.id)){

      const trovato = (await prenotmodel.find({ _id: request.params.id }))[0];//gia preso oggetto non array

      //const nuovo= new usersmodel();
      //c'e' altro modo?

      if(trovato){//??  
        const el= _.pick(request.body, ['pronto']);//controlla che ci sia

        const fin = await prenotmodel.findByIdAndUpdate(trovato._id , el);//restituisce il vecchio
        //?serve?
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

      const trovato = (await prenotmodel.find({ _id: request.params.id }))[0];//gia preso oggetto non array

      //const nuovo= new usersmodel();
      //c'e' altro modo?

      if(trovato){//??  
        const el= _.pick(request.body, ['ritirato']);//se non c'è?

        const fin = await prenotmodel.findByIdAndUpdate(trovato._id , el);
        //?serve?
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

  //riaggiungi quantita x ogni prodotto    altra route??
  const pre=await prenotmodel.findOne({ _id: request.params.id });
  const user= await usersmodel.findOne({ _id: request.decoded.user.id });
    if(pre && pre.username==user.username){
      //ok
      
      //cacnellare solo prorpie prenotaz!
      //controlla uente e username =====


      //  console.log("mod ")
      //    console.log(request.body);
      pre.lista.forEach(async (e) => {
        
        const element = await prodSchema.findOne({ nome: e.nome });
        if (element) {//magari cancellato nel frattemppo -->non fare nulla
          //x scontato che quantita ci sia e ok
          //if(request.body.aggqta!=undefined && typeof request.body.aggqta == 'number' && request.body.aggqta>0){   //controllare se non è numero
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

            //return element ? response.json(element) : response.sendStatus(404);
          /*}else{
            response.send("qta non valida");
          }*/
        }/*else{
          response.sendStatus(404);
        }*/
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


//mai far crashare
//dove try catch???