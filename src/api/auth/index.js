import _ from 'lodash'
import { Router } from 'express';
import usersmodel from "../../api/users/model.js";
import jwt from "jsonwebtoken";   //va anche installata

const router = new Router();

router.post("/login", async function (request, response) {
//restituisce il token associato 

    const decoded = Buffer.from(request.headers.authorization.split(" ")[1], 'base64').toString('binary');
    const user= decoded.split(":")[0];
    console.log(user)
    const pass= decoded.split(":")[1];
    console.log(pass)

    const trovato= await usersmodel.findOne({username: user, password: pass});

    if(trovato/*.length === 0 */===null){//?
      response.sendStatus(401);
    }else{
      response.send({
        token:
          jwt.sign({
                user: {
                  id: trovato._id
                }
            }, 'secret'),
      });
    }
});

export default router;
