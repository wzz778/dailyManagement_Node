// const mongoose=require('mongoose');
// mongoose.connect('mongodb://localhost/user');
const mongoose=require('./db');
let userschema=new mongoose.Schema({
    username: {
        type: String,
        required: true//必须有
    },
    password: {
        type: String,
        require: true
    },
    account: {
        type: String,
        default: Date.now()+ '-' + Math.round(Math.random() * 1E9)
    },
    email:{
        type: String,
        require: true
    },
    class:{
        type: String,
        default: ''
    },
    learn:{
        type: Number,
        enum: [0, 1],
        default: 0//0前端，1后端
    },
    head:{
        type: String,
        default: '/public/img/userHead.jpg'
    },
    status:{
        type: Number,
        enum: [0, 1],
        default: 0//0普通用户，1管理员
    }
})
module.exports=mongoose.model('User',userschema,'users');