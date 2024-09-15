import jwt from 'jsonwebtoken';

//token generataion
//jwt.sign(payload, secretKey, options)
//we r writing the auth middleware

export const authMiddleware = async (req, res, next) =>{

    // take the token from the user 

   try {
     const authHeader =  req.headers.authorization
 
     // check whether the header data is valid or not
 
     if (!authHeader || !authHeader.startsWith('Bearer ')){
         return res.status(401).json({
             message: "Invalid token"
         })
     }
 
     // take the token from the header and verify the token 
 
     const token = authHeader.split(' ')[1];
 
     const decode = jwt.verify(token, process.env.JWT_SECRET )
 
     req.userId = decode.userId
     
     next();
   } catch (error) {
    console.log(error)
     return res.status(401).json({
         message: "Token is not valid",
         error: error
     })
    
   }


    
}