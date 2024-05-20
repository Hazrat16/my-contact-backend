const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//@desc Register user
//@route Post /v1/api/users/register
//@access public


const registerUser = expressAsyncHandler(async (req, res) => {
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are required")
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400)
        throw new Error("User already exists")
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password,10)
    console.log("Hashed pass: ",hashedPassword)

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    console.log(`User created ${user}`)

    if(user){
        res.status(201).json({_id:user.id,email:email})
    }else{
        throw new Error("User data is not valid");
    }

    res.json({message:"Register the user successfully"})
});


//@desc login user
//@route Post /v1/api/users/login
//@access public

const loginUser = expressAsyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are required")
    }
    const user = await User.findOne({email})
    //compare pass with hash pass
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            }
        },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:"30m"}
    )
    res.status(200).json({accessToken})
    }else{
        res.status(401);
        throw new Error("Email or Password are not valid")
    }
});


//@desc Get Current user
//@route Get /v1/api/users/current-user
//@access private


const currentUser = expressAsyncHandler(async (req, res) => {
    res.json(req.user)
});

module.exports = {registerUser,loginUser,currentUser}