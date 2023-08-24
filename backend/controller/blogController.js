const Joi=require("joi");
const fs=require("fs");
const blog=require("../models/blog");
const comment=require("../models/comment");
const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;
const {BACKEND_SERVER_PATH}=require('../config/index');
const blogDTO=require('../dto/blog');
const blogDetailsDTO=require('../dto/blogDetailsDto');

const blogController={
    async create(req,res,next){
        // 1. Validate req body
        // 2. Handle photo storage, naming
        // 3. Add to db
        // 4. Return resoponse
         
        const createBlogSchema =Joi.object({

            author: Joi.string().regex(mongodbIdPattern).required(),
            title: Joi.string().required(),
            content:  Joi.string().required(),
            photo: Joi.string().required()
        });
        const {error}=createBlogSchema.validate(req.body);
        if(error) {
            return next(error);
        }

        const{author,title,content,photo}=req.body;
        // read as buffer

        const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),'base64')


        // allot a random name
        const imagePath=`${Date.now()}-${author}.png`;
        try{
            fs.writeFileSync(`storage/${imagePath}`,buffer);
        }
        catch(err){
            return next(err);
        }

        // save blog in database
        
        let newBlog;
        try{
            newBlog=new blog({
                author,
                title,
                content,
                photoPath:`${BACKEND_SERVER_PATH}/storage/${imagePath}`
            });
            console.log("I am here");
            await newBlog.save();
        }
        catch(err){
            return next(err);
        }
        const blogDto=new blogDTO(newBlog);
        return res.status(200).json({blog: blogDto});
    },
    async getAll(req,res,next){
        try{
            const AllBlogs=await blog.find({});
            const AllblogsTDO=[];
            for (let i=0;i<AllBlogs.length;i++)
            {
                const dto=new blogDTO(AllBlogs[i]);
                AllblogsTDO.push(dto);
            }
            return res.status(200).json({AllblogsTDO});
        }
        catch(err){
            return next(err);
        }
    },
    async getById(req,res,next){
        const getByIdSchema=Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });
       const{error}= getByIdSchema.validate(req.params);
       if(error) {
        return next(error);
       }

        let BlogById;
        const id=req.params.id;
        try{
        BlogById=await blog.findOne({_id:id}).populate('author');
        }
        catch(err){
            return next(err);
        }
        const BlogByIdDTO=new blogDetailsDTO(BlogById);
        return res.status(200).json({blog: BlogByIdDTO});
    },
    async update(req,res,next)
    {
        const updateBlogSchema= Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blogid: Joi.string().regex(mongodbIdPattern).required(),
            photo: Joi.string()
        });
        const {error}=updateBlogSchema.validate(req.body);
        const {title,content,author,blogId,photo}=req.body;
        
        // delete previous photo
 
        // save new photo
        let Blog;

        try
        {
            Blog = await blog.findOne({_id:blogId});
        }
        catch(error)
        {
            return next(error);
        }
        if(photo)
        {
            previousPhoto = Blog.photoPath;
            previousPhoto = previousPhoto.split('/').at(-1);

            //delete 
            fs.unlinkSync(`storage/${previousPhoto}`);

            const buffer = Buffer.from(photo.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),'base64')

            // allot a random name

            const imagePath=`${Date.now()}-${author}.png`;
            try
            {
                fs.writeFileSync(`storage/${imagePath}`,buffer);
            }
            catch(err)
            {
                return next(err);
            }
            try{

            await Blog.updateOne({_id: blogId},{title,content,photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`});
            }
            catch(error)
            {
                return next(err);
            }
        }
        else
        {
            try
            {
                await blog.updateOne({_id: blogId},{title,content});
            }
            catch(err)
            {
                return next(err);
            }
        }
        return res.status(200).json({message: 'blog updated successfully'});
    },
    async delete(req,res,next)
    {
        const getByIdSchema=Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

       const{error}= getByIdSchema.validate(req.params);
       if(error) 
       {
            return next(error);
       }

        let Delete;
        try
        {
            await blog.deleteOne({_id:req.params.id});
            await Comment.deleteMany({blog: id});
        }
        catch(error)
        {
            return next(error);
        }
        return res.status(200).json({message: 'Blog deleted'});

    },
}
module.exports = blogController;
