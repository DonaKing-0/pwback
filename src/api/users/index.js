import _ from 'lodash'
import { Router } from 'express';
import userjwt from '../../services/jwt/index.js'
import usersmodel from "./model.js";
import adminjwt from '../../services/jwt/indexadmin.js'

const router = new Router();

//solo utente accede a propri dati e può modificarli/eliminarli

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

//lista utenti
//admin
router.get("/", adminjwt, async function (request, response) {
  const lista = await usersmodel.find();               //vero json
  return response.json(_.map(lista, (user) => _.omit(user.toJSON(), ['password', '__v'])));
});

//utente per id
//non admin
router.get("/id/:id", userjwt, async function (request, response) {


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
    }else{
      response.sendStatus(401);
    }
  }else{
    console.log("not valid MongodbID");
    response.send("not valid MongodbID");
}
});

//utente per username
//non admin
router.get("/:username", userjwt, async function (request, response) {

  const e = await usersmodel.findOne({ _id: request.decoded.user.id.toString() });

  if(e && e.username==request.params.username){//controllo stesso username
    const element = await usersmodel.findOne({ username: request.params.username });
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
  }else{
    response.sendStatus(401);
  }
});

//nuovo utente -> no jwt
router.post("/"/*, validateJWT*/, async function (request, response) {

  //controlla errori --> se non ci sono tutti campi
  //non username doppi
  /*const user = new usersmodel({
    username: request.body.username,
    password: request.body.password,
  });*/

  if(request.body.username==undefined || request.body.username=='' || request.body.password==undefined || request.body.password ==''){
    response.send("inserire username e password");
    //anche pass obbligat
  }else{
      if(request.body.username.trimStart().trimEnd()=='' || request.body.username.trimStart().trimEnd()==''){
        response.send("inserire username e password");

      }else{
        request.body.username=request.body.username.trimStart().trimEnd();
        request.body.password=request.body.password.trimStart().trimEnd();      
      
        //sse ritorna ''?     rivedi anche in prodotti --->ok
    
        const element = await usersmodel.findOne({ username: request.body.username });
        if(element){
          response.send("username già usato");
        }else{
    
          return response.json(await usersmodel.create(request.body));
        }
      }
      //await user.save();
      //return response.sendStatus(201);
  }
});

//mod per id
//non admin
router.put("/id/:id", userjwt, async function (request, response) {
  if(isValidObjectId(request.params.id)){

    if(request.decoded.user.id.toString()==request.params.id){
      const trovato = (await usersmodel.find({ _id: request.params.id }))[0];//gia preso oggetto non array

      //const nuovo= new usersmodel();
      //c'e' altro modo?

      if(trovato){//??  
        const el= _.omit(request.body, ['_id', 'username']);//non modificabili

        console.log("Modificato utente: ");
        console.log(el);

      /* if (request.body.password !== undefined) {
          trovato.password = request.body.pass;
        }*/
        const fin = await usersmodel.findByIdAndUpdate(request.params.id, el);
        if (fin.length === 0) {//non c'e' piu
          response.sendStatus(404);
        } else {
          response.json(_.omit(fin.toJSON(), ['__v', '_id']));
        }
        //return element ? response.json(element) : response.sendStatus(404);
      }else{
        response.sendStatus(404);
      }
    }else{
      response.sendStatus(401);
    }
  }else{
    console.log("not valid MongodbID");
    response.send("not valid MongodbID");
  }
});

//mod per username
//non admin
router.put("/:username", userjwt, async function (request, response) {

  const e = await usersmodel.findOne({ _id: request.decoded.user.id.toString() });

  if(e && e.username==request.params.username){//controllo stesso username
    const trovato = (await usersmodel.find({ username: request.params.username }))[0];//gia preso oggetto non array

    //const nuovo= new usersmodel();
    //c'e' altro modo?

    if(trovato){//??  
      const el= _.omit(request.body, ['_id', 'username']);//non modificabili

      //se aggiunti campi nel req.body li aggiunge?!    sembra di no

      console.log("Modificato utente: ");
      console.log(el);

    /* if (request.body.password !== undefined) {
        trovato.password = request.body.pass;
      }*/
      const fin = await usersmodel.findOne({ username: request.params.username });

      //manca  update

      if (fin.length === 0) {//non c'e' piu
        response.sendStatus(404);
      } else {
        fin.set(el);
        await fin.save();
        response.json(_.omit(fin.toJSON(), ['__v', '_id']));
      }
      //return element ? response.json(element) : response.sendStatus(404);
    }else{
      response.sendStatus(404);
    }
  }else{
    response.sendStatus(401);
  }
});

//elimin per id   ?nome?serve?
//non admin
router.delete("/:id", userjwt, async function (request, response) {

  if(request.decoded.user.id.toString()==request.params.id){
    const elim= await usersmodel.findByIdAndDelete(request.params.id);//controlli sull elimina
    console.log(elim);
    return response.sendStatus(204);
  }else{
    response.sendStatus(401);
  }
});

export default router;