const Joi =require('joi');  
const User=require('../models/user');
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;
const bcrypt = require('bcryptjs');
const userDTO=require('../dto/user');
const JWTService=require('../services/JWTService');
const RefreshToken=require('../models/token');

const authController = {
    async login(req,res,next) 
    {
        const {username,password}=req.body;
        let user;

        try{
            // match username
            user=await User.findOne({username:username}); 
            if(!user)
            {
                console.log("User not found");

                const error={
                    status: 401,
                    message: 'Invalid username'
                }
                return next(error);
            }
            const match = await bcrypt.compare(password,user.password);
            if(!match)
            {
                const error={
                    status:401,
                    message: 'Invalid password'
                }
                return next(error);
            }
        }
        catch(error)
        {
            return next(error);
        }
        const acccessToken=JWTService.signAccessToken({_id: user._id},'30m');
        const refreshToken=JWTService.signRefreshToken({_id: user._id},'60m');

        try{
            // update refreshToken in database
            await RefreshToken.updateOne({
                _id: user._id
            },
            {token: refreshToken},
            {upsert: true}
        )
        }
        catch(error){
            return next(error);
        }

        res.cookie('accessToken',acccessToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
        })
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24,
            httpOnly:true
        })
        const userDto=new userDTO(user);

        return res.status(200).json({user: userDto,auth: true});

    },
    // User register
    async register(req,res,next)
    {
        console.log("register");
        const userRegisterSchema =Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });
        const{error}=userRegisterSchema.validate(req.body);

        if(error){
            return next(error);
        }
        const {username,name,email,password}=req.body;
        try{
            const emailInUse=await User.exists({email});
            const usernameInUse=await User.exists({username});
            if(emailInUse)
            {
                const error={
                    status: 409,
                    message: 'Email already exists'
                }
                return next(error);
            }
            if(usernameInUse)
            {

                const error={
                    status: 409,
                    message: 'Username not available.'
                }
                return next(error);
            }
        }
        catch(error)
        {
            return next(error);
        }
        const hashedPassword = await bcrypt.hash(password,10);
        let accessToken;
        let refreshToken;
        let user;

        try{
            const userToRegister=new User({
                username:username,
                email: email,
                name: name,
                password:hashedPassword
            })
            user=await userToRegister.save();
            //token Generation
            accessToken = JWTService.signAccessToken({_id: user._id},'30m');
            refreshToken = JWTService.signRefreshToken({_id: user._id},'60m');
        }
        catch(error)
        {
            return next(error);
        }
        // store refresh token in database
        await JWTService.storeRefreshToken(refreshToken,user._id);
        res.cookie('accessToken',accessToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
        });
        res.cookie('refreshToken',refreshToken,{
            maxAge: 1000*60*60*24,
            httpOnly:true
        });

        const userDto=new userDTO(user);
        return res.status(201).json({user:userDto, auth:true});
    },
    async logout(req,res,next){
        // delete refresh taken from db
        const {refreshToken}=req.cookies;
        
        try{
            RefreshToken.deleteOne({token: refreshToken});
        }
        catch(error)
        {
            return next(error);
        }
        // clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({user:null,auth:false});
    },
    async refresh(req,res,next){
        // 1 get refresh tokemn from cookies
        // 2 verify refresh token
        // 3 generate new tokens
        // 4 update db, return response 

        const originalRefreshToken= req.cookies.refreshToken;
        let id;
        try{
            id= JWTService.verifyRefreshToken(originalRefreshToken)._id;
        }
        catch(e){
            const error={
                status: 401,
                message: 'Unauthorized'
            }
            return next(error);
        }
        try{
            const match=RefreshToken.findOne({_id:id, token:originalRefreshToken});
            if(!match)
            {
                const error={
                    status: 401,
                    message:'Unauthorized'
                }
                return next(error);
            }
        }
        catch(e){
            return next(error);
        }
        try{

            const accessToken=JWTService.signAccessToken({_id:id},'30m');
            const refreshToken=JWTService.signRefreshToken({_id:id},'60m');
            await RefreshToken.updateOne({_id:id},{token:refreshToken});
            
            res.cookie('accessToken',accessToken,{
                maxAge:1000*60*60*24,
                httpOnly:true
            });

            res.cookie('refreshToken',refreshToken,{
                maxAge:1000*60*60*24,
                httpOnly:true
            });

            console.log("User found Match");
        }
        catch(e){
            return next(e);
        }

        const user = await User.findOne({_id:id});
        const userDto =  new userDTO(user);
        return res.status(200).json({user:userDto,auth:true});
    }
}
module.exports = authController;
