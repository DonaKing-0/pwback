import _ from 'lodash'
import { Router } from 'express';
import prodSchema from './model.js'
import altroSchema from '../altro/model.js'
import adminjwt from '../../services/jwt/indexadmin.js'
import userjwt from '../../services/jwt/index.js'

  // Requiring ObjectId from mongoose npm package
  import mongoose from 'mongoose'
  const ObjectId = mongoose.Types.ObjectId


const router = new Router();

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

//lista tutti prodotti
router.get("/"/*, validateJWT*/, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    return response.json(await prodSchema.find());
  /*}else{
    response.sendStatus(401);
  }*/
});

//anche filtri front??
//lista con filtri              no ordinam fatto front
router.get("/filtri"/*, validateJWT*/, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){

  //disponibile offerta categoria stagione
      //+categorie? +stagioni?              sembra funzionare

      const filt={}

      //controllo che stagioni e categorie siano valide??? ->no al max non trova

      if(request.body.disponibile==true){
        filt.disponibile=true;
      }
      if(request.body.offerta==true){
        filt.offerta=true;
      }
      if(request.body.categoria!=undefined){
        filt.categoria=request.body.categoria;
      }
      if(request.body.stagione!=undefined){
        filt.stagione=request.body.stagione;
      }
        //se uno è nullo funzia?
        console.log(filt)
        console.log(await prodSchema.find(filt))
        //attenzione ai bool  se false tutti  se true solo offerte
//se non trovato ...

    return response.json(await prodSchema.find(filt));
  /*}else{
    response.sendStatus(401);
  }*/
});

//prodotto per id
router.get("/id/:id"/*, validateJWT*/, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){

  //controlla che sia un id valido
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("not valid MongodbID");
      response.send("not valid MongodbID");
    }

  /*}else{
    response.sendStatus(401);
  }*/
});

//prodotto per nome
router.get("/:nome"/*, validateJWT*/, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    const element = await prodSchema.findOne({ nome: request.params.nome });
    return element ? response.json(element) : response.sendStatus(404);
  /*}else{
    response.sendStatus(401);
  }*/
});

//nuovo prodotto
//admin
router.post("/", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("nuovo ")
    console.log(request.body);  

    if(request.body.quantita!=undefined){//se quantita=0 disp = 0
      if(request.body.quantita<0){
        request.body.quantita=0;
      }
      if(request.body.quantita==0){
        request.body.disponibile=false;
      }
      if(request.body.quantita>0){
        request.body.disponibile=true;
      }
    }

    if(request.body.disponibile!=undefined){//controlla se true non se esiste??
      request.body.disponibile=JSON.parse(request.body.disponibile);//true false senza ""

      if(request.body.disponibile==false){
        request.body.quantita=0;
      }
      if(request.body.disponibile==true && request.body.quantita==undefined){//
        request.body.disponibile=false;
      }
    }

      //  da vedere se il body è giusto 

      //controlla nome non già presente!!!

      //nome obblig   se non c'è usa id generato      no obbligatorio

      if(request.body.nome==undefined || request.body.nome==''){
        response.send("inserire nome");
      }else{

        if(request.body.username.trimStart().trimEnd()==''){
          response.send("inserire username");
  
        }else{

          request.body.nome=request.body.nome.trimStart().trimEnd();

          const element = await prodSchema.findOne({ nome: request.body.nome });
          if(element){
            response.send("nome già presente");
          }else{

            //controllo stag categ unit
            const e= await altroSchema.findOne();

            if(e.stagioni.includes(request.body.stagione) && e.categorie.includes(request.body.categoria) && e.unitamisura.includes(request.body.unita)){
              return response.json(await prodSchema.create(request.body));
            }else{
              response.send("stagione/categoria/unitamisura non valida");
            }

  //          return response.json(await prodSchema.create(request.body));
          }
        }
      }
      //stessa cosa simile x qta e disp

  /*}else{
    response.sendStatus(401);
  }*/
});

//mod prodotto per id
//admin
router.put("/id/:id", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    console.log(request.body);

    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id', 'nome']);
        console.log(el);

        element.set(el);
  
          //controlla
            // + elem insieme?      si
  
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }

  /*}else{
    response.sendStatus(401);
  }*/
});

//agg qta  
//non admin
router.put("/aggqta/:nome", userjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    console.log(request.body);
    const element = await prodSchema.findOne({ nome: request.params.nome });
    if (element) {
      if(request.body.aggqta!=undefined && typeof request.body.aggqta == 'number' && request.body.aggqta>0){   //controllare se non è numero
        if(element.quantita==undefined){
          element.quantita=0;             //non dovrebbe servire?
        }
        const el={
          "quantita": element.quantita+request.body.aggqta,
          "disponibile": true
        }
        
        console.log(el);
        element.set(el);
        await element.save();

        return element ? response.json(element) : response.sendStatus(404);
      }else{
        response.send("qta non valida");
      }
    }else{
      response.sendStatus(404);
    }
  /*}else{
    response.sendStatus(401);
  }*/
});

//sott qta 
//non admin 
router.put("/sottqta/:nome", userjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    console.log(request.body);
    const element = await prodSchema.findOne({ nome: request.params.nome });
    if (element) {
      if(request.body.sottqta!=undefined && typeof request.body.sottqta == 'number' && request.body.sottqta>0){   //controllare se non è numero
        if(element.quantita==undefined){
          element.quantita=0;             //non dovrebbe servire?
        }
        console.log(element.quantita)
        console.log(request.body.sottqta)

        if(element.quantita-request.body.sottqta>=0){
          const el={
            "quantita": element.quantita-request.body.sottqta,
            "disponibile": true
          }
          
          console.log(el);
          element.set(el);
          await element.save();
  
          return element ? response.json(element) : response.sendStatus(404);
        }else{
          response.send("qta non disponibile");
        }
      }else{
        response.send("qta non valida");
      }
    }else{
      response.sendStatus(404);
    }
  /*}else{
    response.sendStatus(401);
  }*/
});

//mod prodotto per nome
//admin
router.put("/:nome", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    console.log(request.body);
    const element = await prodSchema.findOne({ nome: request.params.nome });
    if (element) {
      const el= _.omit(request.body, ['_id', 'nome']);

//attenzione mod quantita e disponibile   anche se fatte anche frontend
//qta 0 ->dispo no
//disp no -> qta 0


//attenzione con gli zeri
      if(el.quantita!=undefined){//se quantita=0 disp = 0
        if(el.quantita<0){
          el.quantita=0;
        }
        if(el.quantita==0){
          el.disponibile=false;
        }
        if(el.quantita>0){
          el.disponibile=true;
        }
      }
      //se ci sono entrambi vince qta xke prima
      //ma se non c'è
      if(el.disponibile!=undefined){//controlla se true non se esiste??
        el.disponibile=JSON.parse(el.disponibile);//true false senza ""

        if(el.disponibile==false){
          el.quantita=0;
        }
        if(el.disponibile==true && el.quantita==undefined){//
          if(element.quantita!=undefined && element.quantita==0)
          el.disponibile=false;
        }
        //si  controlla vecchia qta element.quantita no 0 ok altrim el.disponibile =no
        //no  qta 0

      }


      console.log(el);
      element.set(el);
      await element.save();
    }
    return element ? response.json(element) : response.sendStatus(404);

  /*}else{
    response.sendStatus(401);
  }*/
});

/*router.put("/adduser/:id", validateJWT, async function (request, response) {
  if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("\n\n\nAdding an User to Commesse:\n")
    const element = await prodSchema.findOne({ _id: request.params.id });
    if (element) {
      const e = element.idPersone;
      e.push(request.body.idPersona);
      console.log(element.idPersone);
      element.set(element.idPersone);
      //    element.set(request.body);
      element.set(element.personeEffettive = element.personeEffettive + 1);
      console.log(element);
      await element.save();
    }
    return element ? response.json(element) : response.sendStatus(404);

  }else{
    response.sendStatus(401);
  }
});

router.put("/deleteuser/:id", validateJWT, async function (request, response) {
  if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("\n\n\nDelete an User from Commesse:\n")
    console.log(request.body);
    const element = await prodSchema.findOne({ _id: request.params.id });
    if (element) {
      const e = element.idPersone;
  
      const index = e.indexOf(request.body.id);
      console.log(index);
  
      e.splice(index, 1);
  
      element.set(element.idPersone);
      element.set(element.personeEffettive = element.personeEffettive - 1);
  
      //element.set(request.body);
      await element.save();
    }
    return element ? response.json(element) : response.sendStatus(404);

  }else{
    response.sendStatus(401);
  }
});
*/

//elimina per id
//admin
router.delete("/id/:id", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("elim ")
    console.log(request.body);
    if(isValidObjectId(request.params.id)){
      const result = await prodSchema.deleteOne({ _id: request.params.id });
      return result.deletedCount > 0 ? response.sendStatus(204) : response.sendStatus(404);
    }else{
      console.log("not valid MongodbID");
      response.send("not valid MongodbID");
    }

  /*}else{
    response.sendStatus(401);
  }*/
});

//elimina per nome
//admin
router.delete("/:nome", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("elim ")
    console.log(request.body);
    const result = await prodSchema.deleteOne({ nome: request.params.nome });
    return result.deletedCount > 0 ? response.sendStatus(204) : response.sendStatus(404);

  /*}else{
    response.sendStatus(401);
  }*/
});

export default router;