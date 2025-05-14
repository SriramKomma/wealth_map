const User = require('../models/User');
const { hashPassword, comparePassword } = require('../helpers/auth');

const test =(req, res) => {
    res.json('test is working')
}

// Register endpoint
const registerUser = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        // Check if name was entered
        if (!username) {
            return res.json({
                error: "Name is required",
            });
        }

        // Check if password was entered
        if (!password || password.length < 6) {
            return res.json({
                error: "Password is required and should be at least 6 characters long",
            });
        }

        // Check if email is already taken
        const exist = await User.findOne({ email });
        if (exist) {
            return res.json({
                error: "Email is taken already",
            });
        }

        if (password !== confirmPassword) {
            return res.json({
                error: "Passwords do not match",
            });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            username,
            email,
            password : hashedPassword,
            confirmPassword,
        });

        return res.json(user);
    } catch (error) {
        console.log(error);
    }
};

//Login Endpoint
const loginUser = async (req, res) => {
    try{
        const {email,password} = req.body;
        const cleanedEmail = email.trim().toLowerCase();

        // Check if email was entered
        const user = await User.findOne({email: cleanedEmail});
        if(!user){
            return res.json({
                error: "No user found",
            });
        }

        // Check if password match
        const match = await comparePassword(password,user.password);
        if(match){
            return res.json("Passwords match");
        }
        if(!match){
            return res.json({
                error: "Invalid credentials",
            });
        }
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    test,
    registerUser,
    loginUser
}