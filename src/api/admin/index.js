import _ from 'lodash'
import { Router } from 'express';
import adminSchema from './model.js'

const router = new Router();

//non si tocca

//nuovo
/*
router.post("/"/*, validateJWT*//*, async function (request, response) {
  //if(request.user.ruolo && request.user.ruolo=="admin"){
    console.log("nuovo ")
    console.log(request.body);  

    return response.json(await adminSchema.create(request.body));

  /*}else{
    response.sendStatus(401);
  }*/
//});

export default router;