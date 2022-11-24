const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Time= require('../models/time')
const mail = require('./mail');
const axios =require('axios');
const { request, response } = require('express');
router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})
router.get('/index', function (req, res) {
    console.log(req.session.user);
    res.render('index.html', {
        user: req.session.user
    })
})
router.get('/login', function (req, res) {
    res.render('login.html')
})
router.get('/team', function (req, res) {
    res.render('team.html', {
        user: req.session.user
    })
})
router.get('/myday', function (req, res) {
    res.render('myday.html', {
        user: req.session.user
    })
})
router.get('/teamday', function (req, res) {
    res.render('teamday.html', {
        user: req.session.user
    })
})
router.get('/sort', function (req, res) {
    res.render('sort.html', {
        user: req.session.user
    })
})
router.get('/api/showall', (req, res) => {
    User.find().then(function (date) {
        res.send(date);
    })
})
router.post('/api/showbypage', (req, res) => {
    let pageSize=req.body.pageSize||10;
    let page=parseInt(req.body.page||1);
    let number;
    User.find().then(function (date) {
        return number=date.length;
    }).then(function(number){
        User.find().limit(Number(pageSize)).skip(Number((page-1)*pageSize))
        .then((data)=>{
            let allpage=parseInt(number%pageSize==0?number/pageSize:number/pageSize+1)
            if(page<=allpage&&page>0){
                res.send({
                    'status':1,
                    "number":number,
                    'nowpage':page,
                    'allpage':allpage,
                    'data':data,
                });
            }else{
                res.send('请输入合理的页数！');
            }
        })
    }).catch(()=>{
        res.send('查询失败');
    })
})
router.post('/api/showbyname', (req, res) => {
    var str="^.*"+req.body.name+".*$"
    var reg = new RegExp(str)
    User.find({
		 username:reg
    },function(err,data){
         if(data) return res.send(data)
    return res.send(err)})
})
router.post('/api/showbyid', (req, res) => {
    const id= req.body._id;
    User.findById(id,function (err, ret) {
        if(err){return res.status(500).send("error;")}
        res.send(ret);
    });
})
router.post('/api/deletebyid', (req, res) => {
    const id= req.body._id;
    User.findByIdAndRemove(id,function (err, ret) {
        if (err) res.send({
            status: 0,
            msg: "删除失败！",//状态的描述
        });
        else {
            res.send({
                status: 1,
                msg: "删除成功！",//状态的描述
            })
        };
    });
})
router.get('/api/outlogin', (req, res) => {
    req.session.user = null;
    req.session.login='0';
})
router.post('/api/login', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, data) {
        if (err) { return res.status(500).send({ status: 0 }) }
        if (!data) {
            req.session.user=data;
            return res.send({
                status: 0,
                msg: "用户名不存在！",
            });
        } else {
            let password = data.password;
            if (req.body.password == password) {
                req.session.user = data;
                req.session.login='1';
                return res.send({
                    status: 1,
                    msg: "登录成功！",
                    data: data
                });
            } else {
                return res.send({
                    status: 0,
                    msg: "密码错误！",
                });
            }
        }
    })
})
router.post('/api/sendcode', (req, res) => {
    console.log(req.body.email);
    let code = parseInt(Math.random() * 10000);
    mail.send(req.body.email,code)
        .then(() => {
            req.session.code = code;
            res.send({
                status: 1,
                msg: '发送成功！'
            })
        })
        .catch(() => {
            res.send({
                status: 0,
                msg: '发送失败！'
            })
        });
})
router.post('/api/register',(req, res) =>{
    if(req.body.code!=req.session.code){
        return res.send({
            status: 0,
            msg: "验证码错误！",
        });
    }
    User.findOne({
        username: req.body.username
    }).then(function(user){
        if (user) {
            res.send({
                status: 0,
                msg: "用户名已存在！",
            })
        } 
        else {
            return new User(req.body).save();
        }
    }).then(function(ret) {
        if(ret!=undefined){
            console.log(ret);
            req.session.user=ret;
            req.session.login='1';
            res.send({
                status: 1,
                msg: "注册成功！",
                data: ret
            });
        }
    })
    .catch((err)=>{
        res.send({
            status: 0,
            msg: "注册失败！",
        });
    })
})
router.post('/api/adduser', (req, res) => { 
    console.log(req.body);
    User.findOne({
        username: req.body.username
    }).then(function(user){
        if (user) {
            res.send({
                status: 0,
                msg: "用户名已存在！",
            })
        } 
        else {
            return new User(req.body).save();
        }
    }).then(function(ret) {
        if(ret!=undefined){
            res.send({
                status: 1,
                msg: "添加成功！",
                data: ret
            });
        }
    })
    .catch((err)=>{
        res.send({
            status: 0,
            msg: "注册失败！",
        });
    })
})
router.post('/api/updata',(req, res) =>{
    User.findOne({
        username: req.body.username
    }).then(function(user){
        if (user) {
            if(req.session.user.username==user.username){
                return User.findByIdAndUpdate(req.body._id,req.body)
            }else{
                res.send({
                    status: 0,
                    msg: "用户名已存在！",
                })
            }
        } 
        else {
            return User.findByIdAndUpdate(req.body._id,req.body)
        }
    }).then((ret)=>{
        if(ret!=undefined){
            res.send({
                status: 1,
                msg: "修改成功！",//状态的描述
                data: ret//响应的数据
            });
            const id=ret._id;
            User.findById(id,function (a) {
                console.log(a);
                req.session.user=a;
            });
            req.session.login='1';
        }
    })
    .catch((err)=>{
        res.send({
            status: 0,
            msg: "修改失败！",//状态的描述
        });
    })
})
router.post('/api2/addtime', (req, res) => { 
    new Time(req.body).save(function (err,ret) {
            if (err) res.send(err);
            else{res.send(ret)}
    });
})
router.post('/api2/endtime', (req, res) => { 
    Time.findByIdAndUpdate(req.body._id,req.body,function (err, ret) {
        if (err) res.send({
            status: 0,
            msg: "修改失败！",//状态的描述
        });
        else {
            res.send({
                status: 1,
                msg: "修改成功！",//状态的描述
                data: ret//响应的数据
            })
        };
    });
})
function resort(array){
    var arr=array;
    var temp;
    for(i=0;i < arr.length/2;i++){
    temp=arr[i];
    arr[i]=arr[arr.length-1-i];
    arr[arr.length-1-i]=temp;
    }
    return arr;
}
router.post('/api2/mytime', (req, res) => { 
    let useraccount=req.body.useraccount;
    User.aggregate([
    {
        $lookup:{
            from:'times',
            localField:'account',
            foreignField:'userid',
            as:"items"
        }
    },
    {
        $match:{'account':useraccount}
    },  
    ],function(err,docs){
        if (err) res.send(err);
        else{res.send(docs[0])}
    })
})
router.post('/api2/mylearntime', (req, res) => { 
    let useraccount=req.body.useraccount;
    Time.aggregate([
        {
            $match:{'userid':useraccount}
        },  
        ],function(err,docs){
            if (err){
                res.send(err);
            }else{
                let sum=0;
                for(let i=0;i<docs.length;i++){
                    if(docs[i].time!=''){
                        sum+=parseInt(docs[i].time);
                    }
                }
                res.send(sum.toString());
            }
        })
})
router.get('/api2/getlearnsort', (req, res) => { 
    User.aggregate([
        {
            $lookup:{
                from:'times',
                localField:'account',
                foreignField:'userid',
                as:"items"
            }
        },
        ],function(err,docs){
            if (err) res.send(err);
            else{
                for(let i in docs){
                    let sum=0;
                    for(let n in docs[i].items){
                        if(docs[i].items[n].time!=''){
                            sum+=parseInt(docs[i].items[n].time)
                        }
                    }
                    docs[i].items=sum
                }
                res.send(docs)
            }
        })
})
router.post('/api2/alltime', (req, res) => {
    User.aggregate([
    {
        $lookup:{
            from:'times',
            localField:'account',
            foreignField:'userid',
            as:"items"
        }
    },
    ],function(err,docs){
        if (err) res.send(err);
        else{res.send(resort(docs))}
    })
})
router.post('/api2/deletetime', (req, res) => {
    Time.findByIdAndRemove(req.body._id,function (err, ret) {
        if (err) res.send({
            status: 0,
            msg: "删除失败！",//状态的描述
        });
        else {
            res.send({
                status: 1,
                msg: "删除成功！",//状态的描述
            });
        };
    });
})
router.post('/api2/showkwarnbyname', (req, res) => {
    var str="^.*"+req.body.name+".*$"
    var reg = new RegExp(str)
    User.find({
		 username:reg
    },function(err,data){
         if(data){
                for(let i in data){
                    let useraccount=data[i].account;
                    data[i]=data[i].account;
                }
            return  res.send(data);
         }
        return res.send(err)})
})

// axios.get('http://127.0.0.1/api2/getlearnsort',
// // {
// //     params:{
// //         username:'wzz'
// //     }
// // }
// )
// .then((response) => {
//   console.log(response)
// })
// .catch(function(error) {
//   console.log(error)
// })
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
 
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
axios.defaults.baseURL='http://127.0.0.1/';
axios.defaults.method='GET';//设置默认的
let axios1=axios.create({
    baseURL:'http://127.0.0.1/'
})
router.post('/api2/222', (req, res) => {
    axios1.post( '/api/login',
    {
        username:req.body.username,
        password:req.body.password
    }
  ).then(response=>{
    console.log(response.data);
  }).catch(function (error) {
    console.log(error);
  });
})
// axios1.post( 'http://127.0.0.1/api/login',{
//         username:'wzz',
//         password:'wzz111'
//     }
//   ).then(response=>{
//     console.log(response.data);
//   }).catch(function (error) {
//     console.log(error);
//   });
// ;
axios.defaults.baseURL='http://127.0.0.1/';
axios.defaults.method='GET';//设置默认的

// axios({
//     // method: 'GET',
//     url: '/api2/getlearnsort',
//     // data: {
//     //   firstName: 'Fred',
//     //   lastName: 'Flintstone'
//     // }
//   }).then(response=>{
//     console.log(response);
//   });
module.exports = router;