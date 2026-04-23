import jwt from 'jsonwebtoken';

export const generateToken = (userId) =>{
return jwt.sign(
    {id:userId},  // payload what we store
    process.env.JWT_SECRET,
    {expiresIn: '7d'}
);
};