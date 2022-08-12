import _ from 'lodash'
import { Router } from 'express';
import adminmodel from "../../api/admin/model.js";
import jwt from "jsonwebtoken";   //va anche installata

const router = new Router();

router.post("/adminlogin", async function (request, response) {
//restituisce il token associato 
/*
  if(request.user!==undefined){//token valido --> mostra utente
    response.send(request.user);
  }else{*/
    const decoded = Buffer.from(request.headers.authorization.split(" ")[1], 'base64').toString('binary');
    const user= decoded.split(":")[0];
    console.log(user)
    const pass= decoded.split(":")[1];
    console.log(pass)

    const trovato= await adminmodel.findOne({usernameadmin: user, passwordadmin: pass});

    //const trovato= await usersmodel.find({username: user, password: pass});
    /*console.log(a);
    const trovato= _.find(db.users.list(), (us)=>{
      if(user===us.username && pass===us.password){
        return true;
      }
    });
    console.log(trovato);*/
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
  //}
});

export default router;
