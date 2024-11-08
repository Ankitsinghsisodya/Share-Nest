import jwt from 'jsonwebtoken';

const NODE_ENV = "production"
const JWT_SECRET = "AnkitSingh"
export const generateTokenAndSetCookie = async(userId,res)=>{
    const token = jwt.sign({userId},JWT_SECRET,{
        expiresIn:'1d'
    });
    res.cookie("jwt",token,{
        maxAge: 1*24*60*60*1000,//MS
        httponly: true, //prvent xss attacks cross-site scripting attacks
        sameSite : "strict",//CSRF attacks cross-site request forgery attacks
        secure : NODE_ENV !== "development",
    });
};