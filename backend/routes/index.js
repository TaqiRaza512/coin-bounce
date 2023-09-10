const express= require('express');
const router = express.Router();
const authController=require('../controller/authController');
const blogController=require('../controller/blogController');
const commentController=require('../controller/commentController');
const auth=require('../middleware/auth')


//##################### User ################################

router.get('/test',(req,res)=>res.json({msg:'working'}))

// register
router.post('/register',authController.register);

// login
router.post('/login',authController.login);

// logout
router.post('/logout',auth,authController.logout);

// refresh
router.get('/refresh',authController.refresh);     

//##################### Blog ################################

router.post('/blog',auth,blogController.create);

// get all
router.get('/blog/all',auth, blogController.getAll);

// get blog by id
router.get('/blog/:id',auth, blogController.getById);

// update
router.put('/blog',auth, blogController.update);

// delete
router.delete('/blog/:id',auth, blogController.delete);


//##################### Blog ################################



router.post('/comment',auth,commentController.create);

// get comment by id
router.get('/comment/:id',auth, commentController.getCommentsByBlogId);

module.exports=router;

