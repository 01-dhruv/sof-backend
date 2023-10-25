import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import users from '../models/auth.js'


export const signup = async (req, res) =>{
    const { name, email, password } = req.body;
    try {
        const exisitinguser = await users.findOne( {email} )
        if(exisitinguser){
            return res.status(404).json({message : "User Already Exist"})
        }

        const hasedpassword = await bcrypt.hash(password, 12)
        const newUser = await users.create({name, email, password: hasedpassword})
        const token = jwt.sign({email : newUser.email, id: newUser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({result: newUser, token})

    } catch (error) {
        res.staus(500).json("Something Went Wrong")
    }
}


export const login = async (req, res) =>{
    const { email, password } = req.body;

    try {
        const exisitinguser = await users.findOne( {email} )
        if(!exisitinguser){
            return res.status(404).json({message : "User Does Not Exist"})
        }

        const isPasswordCrt = await bcrypt.compare(password, exisitinguser.password)
        if(!isPasswordCrt){
            return res.status(400).json({message : "Invalid Credentials"})
        }

        const token = jwt.sign({email : exisitinguser.email, id: exisitinguser._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({result: exisitinguser, token})

    } catch (error) {
        res.staus(500).json("Something Went Wrong")
    }

}