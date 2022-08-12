import _ from 'lodash'
import { Router } from 'express';
import altroSchema from './model.js';
import adminjwt from '../../services/jwt/indexadmin.js'

const router = new Router();

//un solo altro
//non creabile
//non eliminabile
//non mod tutto assieme

//agg eli *3

//lista
router.get("/", adminjwt , async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    return response.json(await altroSchema.find());
  /*}else{
    response.sendStatus(401);
  }*/
});

//non array
router.get("/uno", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){ 
    const a=_.pick(await altroSchema.findOne(), ['stagioni', 'categorie', 'unitamisura']);
    console.log(a)
    return response.json(a);
  /*}else{
    response.sendStatus(401);
  }*/
});

//nuovo
/*router.post("/"/*, validateJWT*//*, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("nuovo ")
    console.log(request.body);  

    return response.json(await altroSchema.create(request.body));

  /*}else{
    response.sendStatus(401);
  }*/
//});


//si pu senza id? find one
//sembrerebbe

//mod per id
router.put("/id/:id", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    console.log(request.body);
/*
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id']);
        console.log(el);

        element.set(el);
    
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }
*/
console.log(await altroSchema.findOne());

  /*}else{
    response.sendStatus(401);
  }*/
});

//agg stag
router.put("/aggstag", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
/*
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id']);
        console.log(el);

        element.set(el);
    
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }
*/
//controlla non ripetute
    if(request.body.stagione!=undefined && request.body.stagione!=''){

      console.log("mod ")
      request.body.stagione=request.body.stagione.trimStart().trimEnd();
      console.log(request.body);

      const elem= await altroSchema.findOne();
      const e = elem.stagioni;

      if(e.includes(request.body.stagione)){
        response.send("stag già presente");
      }else{
        e.push(request.body.stagione);
        console.log(elem);

        elem.set(elem);
        await elem.save();

        return elem ? response.json(elem) : response.sendStatus(404);
      }
    }else{
      response.send("inserire stagione");
    }
  /*}else{
    response.sendStatus(401);
  }*/
});

//elim stag
router.put("/elimstag", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    //request.body.stagione=request.body.stagione.trimStart().trimEnd();
    console.log(request.body);
/*
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id']);
        console.log(el);

        element.set(el);
    
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }
*/
  const elem= await altroSchema.findOne();

  const e = elem.stagioni;
  console.log(e)

      if(e.includes(request.body.stagione)){

        e.splice(e.indexOf(request.body.stagione),1);
        console.log(elem);

        elem.set(elem);
        await elem.save();

        return elem ? response.json(elem) : response.sendStatus(404);

      }else{
        if(request.body.stagione){
            response.send("stag non presente");
        }else{
          response.send("stag non valida");          
        }
      }
  /*}else{
    response.sendStatus(401);
  }*/
});

//agg categoria
router.put("/aggcat", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
/*
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id']);
        console.log(el);

        element.set(el);
    
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }
*/
//controlla non ripetute
    if(request.body.categoria!=undefined && request.body.categoria!=''){

      console.log("mod ")
      request.body.categoria=request.body.categoria.trimStart().trimEnd();
      console.log(request.body);

      const elem= await altroSchema.findOne();
      const e = elem.categorie;

      if(e.includes(request.body.categoria)){
        response.send("categ già presente");
      }else{
        e.push(request.body.categoria);
        console.log(elem);

        elem.set(elem);
        await elem.save();

        return elem ? response.json(elem) : response.sendStatus(404);
      }
    }else{
      response.send("inserire categoria");
    }
  /*}else{
    response.sendStatus(401);
  }*/
});

//elim categ
router.put("/elimcat", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    //request.body.stagione=request.body.stagione.trimStart().trimEnd();
    console.log(request.body);
/*
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id']);
        console.log(el);

        element.set(el);
    
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }
*/
  const elem= await altroSchema.findOne();

  const e = elem.categorie;
  console.log(e)

      if(e.includes(request.body.categoria)){

        e.splice(e.indexOf(request.body.categoria),1);
        console.log(elem);

        elem.set(elem);
        await elem.save();

        return elem ? response.json(elem) : response.sendStatus(404);

      }else{
        if(request.body.categoria){
            response.send("categ non presente");
        }else{
          response.send("categ non valida");          
        }
      }
  /*}else{
    response.sendStatus(401);
  }*/
});

//agg unita
router.put("/aggunit", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
/*
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id']);
        console.log(el);

        element.set(el);
    
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }
*/
//controlla non ripetute
    if(request.body.unita!=undefined && request.body.unita!=''){

      console.log("mod ")
      request.body.unita=request.body.unita.trimStart().trimEnd();
      console.log(request.body);

      const elem= await altroSchema.findOne();
      const e = elem.unitamisura;

      if(e.includes(request.body.unita)){
        response.send("unita già presente");
      }else{
        e.push(request.body.unita);
        console.log(elem);

        elem.set(elem);
        await elem.save();

        return elem ? response.json(elem) : response.sendStatus(404);
      }
    }else{
      response.send("inserire unita misura");
    }
  /*}else{
    response.sendStatus(401);
  }*/
});

//elim unita
router.put("/elimunit", adminjwt, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("mod ")
    //request.body.stagione=request.body.stagione.trimStart().trimEnd();
    console.log(request.body);
/*
    if(isValidObjectId(request.params.id)){
      const element = await prodSchema.findOne({ _id: request.params.id });
      if (element) {
        const el= _.omit(request.body, ['_id']);
        console.log(el);

        element.set(el);
    
        await element.save();
      }
      return element ? response.json(element) : response.sendStatus(404);
    }else{
      console.log("MongodbID non valido");
      response.send("MongodbID non valido");
    }
*/
  const elem= await altroSchema.findOne();

  const e = elem.unitamisura;
  console.log(e)

      if(e.includes(request.body.unita)){

        e.splice(e.indexOf(request.body.unita),1);
        console.log(elem);

        elem.set(elem);
        await elem.save();

        return elem ? response.json(elem) : response.sendStatus(404);

      }else{
        if(request.body.unita){
            response.send("unita non presente");
        }else{
          response.send("unita non valida");          
        }
      }
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

export default router;