const mongoose = require('mongoose');
const {MONGDB_CONNECTION_STRING}=require('../config/index');

const dbConnect = async()=>{
    try
    {
        const conn=await mongoose.connect(MONGDB_CONNECTION_STRING);
        console.log("Data base connected");
    }
    catch(error)
    {
        console.log("Error: "+error);
    }

}
module.exports =dbConnect
