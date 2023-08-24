const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const blogSchema =new Schema({
    title: {type:String,required: true},
    author: {type:mongoose.SchemaTypes.ObjectId,ref: 'User'},
    content: {type:String,required: true},
    photoPath: {type:String,required: true}

},
    {timestamps:true}
);

module.exports=mongoose.model('Blog',blogSchema,'blogs');
