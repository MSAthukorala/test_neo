let jwt = require('jsonwebtoken');
// const secret = require('crypto').randomBytes(84).toString('hex');
const secret = "e561e2dfbc692c583cd5965c6f74899aaa519b5175aea31026ff70cd71187678b65ead9033b627eb155ebec346d3c503e096094f55bee73b87874aac38a1eaf7884071e124deefaec60bd60744a36a1565ff1a32"



module.exports = {
    sign:(userId) => {
        let token = jwt.sign({id: userId},
            secret,{}
          );
        return token;
    },
    check:(req,res,next)=>{
        let token = req.headers['x-access-token'] || req.headers['authorization'];
    
        if(token == undefined){
            return res.status(401).json({
                "error":"token required"
            })
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
    
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    "error":"token invalid"
                })
            } else {
                req.decoded = decoded;
                next();
            }
            });
        } else {
            res.status(401).json({
                "error":"token required"
            })
        }
    }
}