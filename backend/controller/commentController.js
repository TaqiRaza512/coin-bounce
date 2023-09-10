const Joi=require("joi");
const Blog=require("../models/blog");
const Comment=require("../models/comment");
const CommentDTO=require("../dto/comment");

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const commentController={

    async create(req,res,next)
    {
        // content 
        // blog
        // author
        const createCommentSchema=Joi.object({
            content: Joi.string().required(),
            author: Joi.string().regex(mongodbIdPattern).required(),
            blog: Joi.string().regex(mongodbIdPattern).required()
        });
        const {error}=createCommentSchema.validate(req.body);
        if(error)
        {
            return next(error);
        }

        const {content,author,blog}=req.body;
        let newComment;
        try
        {
            newComment=new Comment({author,content,blog});
            await newComment.save();
        }
        catch(err)
        {
            return next(err);
        }

        return res.status(201).json({message: "Comment created"});

    },
    async getCommentsByBlogId(req,res,next)
    {
        const getByIdSchema=Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required()
        });

        const{error}= getByIdSchema.validate(req.params);

        if(error) 
        {
            return next(error);
        }

        let Comments;
        const id=req.params.id;

        try
        {
            Comments=await Comment.find({blog:id}).populate('author');
        }
        catch(err)
        {
            return next(err);
        }
        let AllCommentsDTO=[];
        for(let i=0; i<Comments.length; i++)
        {
            AllCommentsDTO.push(new CommentDTO(Comments[i]));
        }

        // const CommentByIdDTO=new blogDetailsDTO(CommentById);
        
        return res.status(200).json({Comments: AllCommentsDTO});
    },
    async getAll(req,res,next){},
    async update(req,res,next){},
    async delete(req,res,next){},
}

module.exports = commentController;

