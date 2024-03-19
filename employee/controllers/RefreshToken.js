import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// Function to generate an access token
const generateAccessToken = (emp_id, access, email) => {
    // Define payload for the access token
    const payload = {
        emp_id: emp_id,
        access: access,
        email: email
    };

    // Sign the payload with a secret key to generate the access token
    // You can use any algorithm and set an appropriate expiration time
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
    return accessToken;
};

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const { emp_id, access, email } = decoded;
            // Generate a new access token using user information
            const newAccessToken = generateAccessToken(emp_id, access, email);
            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Error refreshing token:", error);
        res.sendStatus(500); // Internal server error
    }
};