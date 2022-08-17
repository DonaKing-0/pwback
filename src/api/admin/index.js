import _ from 'lodash'
import { Router } from 'express';
import adminSchema from './model.js'

const router = new Router();

//non si tocca

//nuovo
/*
router.post("/"/*, validateJWT*//*, async function (request, response) {
    console.log("nuovo ")
    console.log(request.body);  

    return response.json(await adminSchema.create(request.body));

*/
//});

export default router;