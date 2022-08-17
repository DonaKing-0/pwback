import _ from "lodash";
import jwt from "jsonwebtoken";
import usersmodel from "../../api/users/model.js";

async function userjwt(req, res, next){

  if(req.headers.authorization===undefined){//se non c'e token? non autorizz
    res.sendStatus(401);
  }else{

    //controlla jwt non deformato
    //controll sia un jwt
    //-->try catch
    try {
      var decoded = jwt.verify(req.headers.authorization.split(" ")[1], 'secret');
      console.log(decoded);


//controlla vaalida object id???


      const cercato= await usersmodel.find({ _id: decoded.user.id.toString()});

      if(cercato===undefined || cercato.length==0){
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

export default userjwt;