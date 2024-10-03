
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import {linkSync , renameSync,unlinkSync} from "fs"

const maxAge = 3*24*60*60*1000;
const createToken = (email,userId)=>{
    return jwt.sign({email , userId},process.env.JWT_KEY,{expiresIn: maxAge})
};
export const signup = async(request,response,next)=>{
    try {
        const{email,password} = request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password is required,")
        }
        const user = await User.create({email,password});
        response.cookie("jwt",createToken(email , user.id),{
            
            maxAge,
                secure: true,
                sameSite: "None"
        });
        return response.status(201).json({
            user: {
                id : user.id,
                email: user.email,
                profile: user.profileSetup,
            },
        })
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");

        
    }
}

export const login = async(request,response,next)=>{
    try {
        const{email,password} = request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password is required,")
        }
        const user = await User.findOne({email});
            if(!user){
                return response.status(404).send("User with the email is not found")
            }
        const auth = await compare(password,user.password);
        if (!auth) {
            return response.status(400).send("Password is in correct.")
        }
        response.cookie("jwt",createToken(email , user.id),{
            
            maxAge,
            secure: true,
            sameSite: "None"
        });
        return response.status(200).json({
            user: {
                id : user.id,
                email: user.email,
                profile: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.colors
            },
        })
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
};

export const getUserInfo = async (request,response, next) => {
    try {
        // console.log(request.userId);
        const userData = await User.findById(request.userId);
        if (!userData) {
            return response.status(404).send("User with given mail is not found.")
        }

        return response.status(200).json({
            
            id : userData.id,
            email: userData.email,
            profile: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.colors,
                
            
        })
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
}

export const updateProfile = async (request,response, next) => {
    try {
        // console.log(request.userId);
        const { userId }= request;
        const {firstName , lastName,color} = request.body;
        
        if (!firstName || !lastName ) {
            return response.status(400).send("Firstname lastname and color is required.")
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                color,
                profileSetup: true,

            },
            {new: true, runValidators: true}
        ) 

        return response.status(200).json({
            
            id : userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.colors,
                
            
        })
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
}

export const addProfileImage = async (request,response, next) => {
    try {
        if (!request.file){
            return response.status(400).send("File is required")
        }
        
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + request.file.originalname;
        renameSync (request.file.path, fileName);
        const updatedUser = await User.findByIdAndUpdate(
        request.userId,
        { image: fileName },
        { new: true, runValidators: true }
        );
        return response.status(200).json({
        image: updatedUser.image,
        });

        
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
}
export const removeProfileImage = async (request,response, next) => {
    try {
        // console.log(request.userId);
        const { userId }= request;
        const user = await User.findById(userId);
        
        if (!user ) {
            return response.status(404).send("User is not found")
        }
        if(user.image){
            unlinkSync(user.image);

        }
        user.image = null;
        await user.save();

        
        

        return response.status(200).send('Profile image removed successfully.');
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
}
export const logout = async (request,response, next) => {
    try {
        response.cookie("jwt" , "",{maxAge:1 , secure:true , sameSite:"None"})

        
        

        return response.status(200).send('Logout successfully.');
    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error");
    }
}