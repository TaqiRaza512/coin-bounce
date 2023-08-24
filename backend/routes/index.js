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
router.get('/logout',auth,authController.logout);

// refresh
router.get('/refresh',authController.refresh);     

//##################### Blog ################################

router.post('/blog',blogController.create);

// get all
router.get('/blog/all', blogController.getAll);

// get blog by id
router.get('/blog/:id', blogController.getById);

// update
router.put('/blog', blogController.update);

// delete
router.delete('/blog/:id', blogController.delete);

module.exports=router;


//##################### Blog ################################


router.post('/comment',commentController.create);

// get comment by id
router.get('/comment/:id', commentController.getCommentsByBlogId);

module.exports=router;

