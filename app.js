const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('./database/mongoose');
const clientRouter = require('./routes/client-router');
const adminRouter = require('./routes/admin-router');
const visitorRouter = require('./routes/visitor-router');


const port = process.env.PORT || 3000;
const app = express();
app.use(logger('dev'));   



app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});
  
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images/accessories', express.static(path.join(__dirname, 'public/images/accessories')));
app.use('/images/articles', express.static(path.join(__dirname, 'public/images/articles')));
app.use('/join-us/cv', express.static(path.join(__dirname, 'public/join-us-cv')));
console.log(port);

app.use(clientRouter);
app.use(adminRouter);
app.use(visitorRouter);

app.listen(port);
