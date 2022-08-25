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
    return response.json(await altroSchema.find());
});

//non array
router.get("/uno", adminjwt, async function (request, response) {
    const a=_.pick(await altroSchema.findOne(), ['stagioni', 'categorie', 'unitamisura']);
    console.log(a)
    return response.json(a);
});

//nuovo
/*router.post("/"/*, validateJWT*//*, async function (request, response) {
    console.log("nuovo ")
    console.log(request.body);  

    return response.json(await altroSchema.create(request.body));

*/
//});


//mod per id
router.put("/id/:id", adminjwt, async function (request, response) {
    console.log("mod ")
    console.log(request.body);

console.log(await altroSchema.findOne());

});

//agg stag
router.put("/aggstag", adminjwt, async function (request, response) {
//controlla non ripetute
    if(request.body.stagione!=undefined && request.body.stagione!=''){

      console.log("mod ")
      //va anche nell'if!
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
});

//elim stag
router.put("/elimstag", adminjwt, async function (request, response) {
    console.log("mod ")
    console.log(request.body);

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
});

//agg categoria
router.put("/aggcat", adminjwt, async function (request, response) {
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
});

//elim categ
router.put("/elimcat", adminjwt, async function (request, response) {
    console.log("mod ")
    console.log(request.body);

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
});

//agg unita
router.put("/aggunit", adminjwt, async function (request, response) {
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
});

//elim unita
router.put("/elimunit", adminjwt, async function (request, response) {
    console.log("mod ")
    console.log(request.body);

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
});

export default router;