import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
 
export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({
            attributes:['emp_id', 'access' ,'email']
        });
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}
 
export const Register = async(req, res) => {
    const { email, password, confPassword, firstname, lastname, department, access, role, ownership } = req.body;
    if(password !== confPassword) return res.status(400).json({msg: "Password and confirm password does not match"});
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    try {                                                              
        await Users.create({   
            email: email,               
            password: hashPassword,          
            firstname: firstname,        
            lastname: lastname,        
            department: department,          
            access: access,          
            role: role,           
            ownership: ownership            
         
                 
        });
        res.json({msg: "Registration Successful"});
    } catch (error) {
        console.log(error);
    }
}
 
export const Login = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(404).json({ error: "Email not found" });
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(400).json({ error: "Wrong Password" });
        }
        const { emp_id, access, email, role } = user;
        const accessToken = jwt.sign({ emp_id, access, email, role}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        });
        const refreshToken = jwt.sign({ emp_id, access, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                emp_id: user.emp_id
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
 
export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const emp_id = user[0].emp_id;
    await Users.update({refresh_token: null},{
        where:{
            emp_id: emp_id
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}