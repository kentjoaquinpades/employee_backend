import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { db } from "../config/Database.js";
import { checkAccess } from '../middleware/checkAccess.js';


const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
router.get('/all', async (req, res) => {
  const [results, metadata] = await db.query("SELECT * FROM `employees`"); 
  
  res.send(results)
});

router.get('/users/page-kr', verifyToken, checkAccess(['kr']), (req, res) => {
  res.send('Page for KR Access');
});

router.get('/users/page-sbc', verifyToken, checkAccess(['sbc']), (req, res) => {
  res.send('Page for SBC Access');
});

router.get('/users/page-jb', verifyToken, checkAccess(['jb']), (req, res) => {
  res.send('Page for JB Access');
});

router.get('/users/page-pb', verifyToken, checkAccess(['pb']), (req, res) => {
  res.send('Page for PB Access');
});






export default router;