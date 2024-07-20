const JWT = require('jsonwebtoken');

const KEY = 'f5c24c3e6cc2cbe56683d1ece59e65d6f0f574562245c257f144ad0f0b7a919c0aa8b0e569c28ab56a22b30b952d21f0e189508f5ab7146000dd332fe3506a15';

//token kontrolu yapar eğer hata varsa false yoksa data döndürür
function TokenData(token,callback){
   JWT.verify(token,KEY, (err,userdata)=>{
   if(err){
    console.log(err);
    callback(false);
   }else{
    callback(userdata);
   }
  });
}
// token oluşturur 6 saatlik
function createToken(userData){
let sign = JWT.sign(userData,KEY);
return sign;
}

module.exports={
  TokenData,
  createToken,
}