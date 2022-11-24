// const mongoose=require('mongoose');
// mongoose.connect('mongodb://localhost/user');
const mongoose=require('./db');
let timeschema=new mongoose.Schema({
    userid: {
        type: String,
        required: true//必须有
    },
    begintime: {
        type: String,
        require: true
    },
    rebegintime: {
        type: String,
        require: true
    },
    endtime:{
        type: String,
        default: ''
    },
    reendtime:{
        type: String,
        default: ''
    },
    time:{
        type: String,
        default: ''
    },
    status:{
        type: Number,
        enum: [0, 1],
        default: 0//0普通用户，1管理员
    }
})
module.exports=mongoose.model('Time',timeschema,'times');