import _ from "lodash";
import jwt from "jsonwebtoken";
import adminmodel from "../../api/admin/model.js";
import { response } from "express";

async function adminjwt(req, res, next){

  if(req.headers.authorization===undefined){//se non c'e token? non autorizz
    res.sendStatus(401);
  }else{
    //controlla jwt non deformato
    //controll sia un jwt
    //-->try catch
    try {
      var decoded = jwt.verify(req.headers.authorization.split(" ")[1], 'secret');
      console.log(decoded);

      const cercato= await adminmodel.find({ _id: decoded.user.id.toString()});
      if(cercato===undefined){
        res.sendStatus(401);
      }else{
        req.decoded=decoded;
        next();
      }
      
    } catch (error) {
      res.sendStatus(401);
    }
  }
}

export default adminjwt;