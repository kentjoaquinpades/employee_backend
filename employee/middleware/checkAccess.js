import jwt from "jsonwebtoken";



export const checkAccess = (requiredAccess) => {
    return (req, res, next) => {
       
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

   
        if (!token) {
            return res.sendStatus(401);
        }

        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                
                return res.sendStatus(403);
            }

           
            const userAccess = decoded.access;
            checkAccess(requiredAccess)(req, res, () => {
                
                req.user = decoded;
                next();
            });
        });
    };
};


const checkUserAccess = (userAccess, requiredAccess) => {
    
    return requiredAccess.every(access => userAccess.includes(access));
};