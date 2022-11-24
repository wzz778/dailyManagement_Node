const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/user", {useNewUrlParser:true},function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log("数据库连接成功！")
})
module.exports = mongoose;