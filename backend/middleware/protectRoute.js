import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = "AnkitSingh";
export const protectRoute = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({error:"Unauthorised: No token Provided"});
        }
        
        const decoded = jwt.verify(token,JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:'Unauthorised: Inavlid token'});
        }
        //remove password before sending
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({error:"User Not Found"});
        }
        req.user = user;
        next();
    }catch(err){
        console.log("Error in Protected route:"+err.message);
        return res.status(500).json({error:"Internal Server Error"});
    }
}