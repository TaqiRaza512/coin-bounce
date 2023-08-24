
const express = require('express')
const dbConnect=require('./database/index');

const {PORT}=require('./config/index');
const router =require('./routes/index');
const app = express()
const errorHandler=require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');

// Serve static files from a specific directory
app.use('/storage', express.static('./storage'));

dbConnect(); 

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.use(errorHandler);
app.get('/', (req, res) =>res.json({msg: 'Hello World12 !'}));

app.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`)
})