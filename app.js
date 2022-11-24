var express=require('express');
var app=express();
var session=require('express-session');
var path=require('path');
var cors=require('cors');
const axios =require('axios')
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized:true,
    // cookie: { secure: true }
  }))
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.engine('html',require('express-art-template'));
var userrouter=require('./routers/users')
var filerouter=require('./routers/file')
// app.use('/daily/public/',express.static(path.join(__dirname,'./public/')));
app.use('/public/',express.static(path.join(__dirname,'./public/')));
app.use('/node_modules/',express.static(path.join(__dirname,'./node_modules/')));
app.engine('html',require('express-art-template'));
app.set('views',path.join(__dirname,'./views/'))
app.use(userrouter);
app.use(filerouter);

app.listen(80,()=>{
    console.log("http://127.0.0.1");
})